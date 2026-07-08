# Testing Plan

## What I reviewed

This plan is based on the current event flow and related utilities in:

- `src/components/organisms/EventsSection.tsx`
- `src/components/organisms/AddEventForm.tsx`
- `src/components/organisms/EditEventModal.tsx`
- `src/components/molecules/EventCard.tsx`
- `app/api/events/route.ts`
- `app/api/events/[id]/route.ts`
- `app/api/events/map/route.ts`
- `src/lib/eventCoords.ts`
- `src/lib/mapPopupHtml.ts`
- `src/lib/localFeed/parseRss.ts`
- `src/lib/localFeed/weather.ts`

## Quick observations

These are worth testing early because they are the highest-risk behaviors I saw:

1. `app/api/events/route.ts` and `app/api/events/[id]/route.ts` do not currently enforce authentication or authorization on create, update, and delete.
2. `src/components/organisms/EventsSection.tsx` handles create errors, but edit and delete do not surface API failures to the user.
3. `loadEvents()` in `EventsSection` has no error handling, so a failed fetch can leave the UI in a broken or empty state.
4. Date formatting and `datetime-local` conversion rely on `new Date(...)`, so timezone-related regressions are possible.

## Suggested stack

The repo does not currently include a test runner. A practical setup would be:

- Unit and integration: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- API mocking: `msw` or direct module mocking
- End-to-end: `playwright`

Example install:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw playwright
```

## Unit tests

### 1. Coordinate parsing

Target: `src/lib/eventCoords.ts`

Cases:

- `parseBodyCoord(undefined)` returns `{ ok: true, value: null }`
- `parseBodyCoord("")` returns `{ ok: true, value: null }`
- `parseBodyCoord("43.0125")` returns `{ ok: true, value: 43.0125 }`
- `parseBodyCoord("abc")` returns `{ ok: false }`
- `isValidLatLng(43.01, -83.68)` returns `true`
- `isValidLatLng(91, -83.68)` returns `false`
- `isValidLatLng(43.01, -181)` returns `false`

Example:

```ts
import { describe, expect, it } from "vitest";
import { isValidLatLng, parseBodyCoord } from "@/lib/eventCoords";

describe("eventCoords", () => {
  it("treats empty values as null", () => {
    expect(parseBodyCoord("")).toEqual({ ok: true, value: null });
    expect(parseBodyCoord(undefined)).toEqual({ ok: true, value: null });
  });

  it("parses numeric strings", () => {
    expect(parseBodyCoord("43.0125")).toEqual({ ok: true, value: 43.0125 });
  });

  it("rejects invalid values", () => {
    expect(parseBodyCoord("abc")).toEqual({ ok: false });
  });

  it("validates lat/lng ranges", () => {
    expect(isValidLatLng(43.0125, -83.6875)).toBe(true);
    expect(isValidLatLng(91, -83.6875)).toBe(false);
    expect(isValidLatLng(43.0125, -181)).toBe(false);
  });
});
```

### 2. Map popup sanitizing helpers

Target: `src/lib/mapPopupHtml.ts`

Cases:

- `esc()` escapes `<`, `>`, `"`, `'`, `&`
- `safeMapImageUrl()` allows `/local/path.jpg`
- `safeMapImageUrl()` allows `https://...`
- `safeMapImageUrl()` rejects `javascript:...`
- `safeMapImageUrl()` rejects `//example.com/image.jpg`
- `truncate()` keeps short text unchanged
- `truncate()` trims long text and appends `…`

### 3. RSS parsing

Target: `src/lib/localFeed/parseRss.ts`

Cases:

- Parses a normal RSS item with title and link
- Parses CDATA-wrapped title and link
- Decodes HTML entities in title
- Extracts `<source>` correctly
- Respects `limit`
- Skips malformed items missing title or link

### 4. Weather code mapping

Target: `src/lib/localFeed/weather.ts`

Cases:

- `0` maps to `Clear`
- `61` maps to `Rain`
- `71` maps to `Snow`
- `95` maps to `Thunderstorm`
- Unknown code maps to `Mixed`

### 5. Event card rendering

Target: `src/components/molecules/EventCard.tsx`

Cases:

- Renders title, location, description
- Shows image only when `event.image` exists
- Shows map coordinates only when both `latitude` and `longitude` exist
- Hides edit/delete buttons when `showActions` is `false`
- Calls `onEdit` with the event when Edit is clicked
- Calls `onDelete` with the event id when Delete is clicked

## Integration tests

### 1. `EventsSection` loads and displays events

Target: `src/components/organisms/EventsSection.tsx`

Cases:

- Calls `GET /api/events` on mount
- Renders event cards when data is returned
- Shows empty state when API returns `[]`
- Dispatches `townscout-events-refresh` after a successful load

### 2. Add event flow

Cases:

- Authenticated user sees `AddEventForm`
- Guest user does not see `AddEventForm`
- Submitting valid form data sends `POST /api/events`
- Successful create resets the form and reloads events
- Failed create shows `Failed to create event. Please check all fields.`
- Submitting only latitude or only longitude results in an error from the API

Example:

```ts
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EventsSection } from "@/components/organisms/EventsSection";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ status: "authenticated" }),
}));

describe("EventsSection create flow", () => {
  it("creates an event and reloads the list", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "1" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            title: "Farmers Market",
            date: "2026-04-20T16:00:00.000Z",
            location: "Flint",
            description: "Fresh produce",
          },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    render(<EventsSection />);

    await userEvent.type(screen.getByLabelText(/title/i), "Farmers Market");
    await userEvent.type(screen.getByLabelText(/location/i), "Flint");
    await userEvent.type(screen.getByLabelText(/description/i), "Fresh produce");
    await userEvent.type(screen.getByLabelText(/date & time/i), "2026-04-20T12:00");
    await userEvent.click(screen.getByRole("button", { name: /add event/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/events",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
```

### 3. Edit event flow

Cases:

- Clicking Edit opens `EditEventModal`
- Existing values are prefilled
- Saving sends `PUT /api/events/:id`
- Successful save closes the modal and reloads events
- If user session becomes unauthenticated, the modal closes
- API error on edit should keep modal open and show an error

Note: the last behavior is not implemented yet, but it is a good test to add before fixing the UX.

### 4. Delete event flow

Cases:

- Clicking Delete prompts with `confirm`
- Canceling confirm does not call the API
- Confirming sends `DELETE /api/events/:id`
- Successful delete reloads the event list
- Failed delete should show an error and keep the item visible

Note: failure handling is not implemented yet, so this is another good red test to drive improvement.

### 5. API route tests for `/api/events`

Target: `app/api/events/route.ts`

Cases:

- `GET` returns events ordered by `date ASC`
- `POST` returns `400` when required fields are missing
- `POST` returns `400` when latitude is invalid
- `POST` returns `400` when longitude is invalid
- `POST` returns `400` when only one coordinate is provided
- `POST` returns `400` when coordinates are out of range
- `POST` returns `201` with normalized event data when payload is valid

### 6. API route tests for `/api/events/[id]`

Target: `app/api/events/[id]/route.ts`

Cases:

- `PUT` updates an existing event
- `PUT` rejects invalid coordinates
- `PUT` rejects only one coordinate being set
- `DELETE` removes an event by id
- `PUT` and `DELETE` should reject unauthenticated users

Note: auth rejection is not implemented now, but it should be tested once added.

### 7. Map events aggregation

Target: `app/api/events/map/route.ts`

Cases:

- Returns DB events formatted as `MapEventPoint`
- Adds Ticketmaster events when `TICKETMASTER_API_KEY` is set
- Falls back to DB-only events when Ticketmaster fetch fails
- Serializes `date` to ISO string

## End-to-end tests

These are good Playwright scenarios once the basic unit and integration layer exists.

### 1. Guest browsing events

- Visit `/events`
- Confirm events list loads
- Confirm Add/Edit/Delete controls are hidden

### 2. Logged-in event management

- Sign in
- Visit `/events`
- Create a new event
- Verify it appears in the list
- Edit the same event
- Verify updated content appears
- Delete the event
- Verify it disappears

### 3. Map pin behavior

- Create an event with coordinates
- Visit the page that consumes `/api/events/map`
- Verify the event appears as a map pin
- Create an event without coordinates
- Verify it still appears in the list but not as a mappable point

### 4. Local news widget

- Visit the homepage or page using local news
- Verify fallback content renders if external news sources fail
- Verify no broken UI when RSS or API fetch errors occur

## Other tests worth doing

### Accessibility

- Verify all form inputs have labels
- Ensure modal focus is trapped when `EditEventModal` is open
- Ensure Escape closes the modal
- Check keyboard access for Edit/Delete actions
- Run `axe` against `/events` and auth pages

Note: focus trap and Escape handling do not appear to be implemented yet.

### Error-state tests

- Simulate `GET /api/events` failing and confirm the UI shows a helpful message
- Simulate edit/delete failures and confirm the UI does not silently succeed
- Simulate malformed API responses and confirm the component fails safely

### Security tests

- Verify event create/update/delete APIs require authentication
- Verify unauthorized users cannot bypass the hidden UI by calling the API directly
- Verify popup HTML helpers reject dangerous URLs and escaped content is rendered safely

### Date/time tests

- Verify displayed event date is stable across timezones
- Verify `EditEventModal` keeps the expected local date/time when editing an existing event
- Verify server-stored dates round-trip correctly through the form

### Performance and resilience

- Render test with a long event list
- Verify the page remains usable with slow network responses
- Verify repeated refresh events do not cause duplicate or stale UI state

## Good first test files

If you want to add tests incrementally, this would be a strong starting set:

- `src/lib/eventCoords.test.ts`
- `src/lib/mapPopupHtml.test.ts`
- `src/lib/localFeed/parseRss.test.ts`
- `src/components/molecules/EventCard.test.tsx`
- `src/components/organisms/EventsSection.test.tsx`
- `app/api/events/route.test.ts`
- `app/api/events/[id]/route.test.ts`

## Recommended order

1. Start with `eventCoords`, `mapPopupHtml`, and `parseRss` unit tests.
2. Add `EventCard` and `EventsSection` integration tests.
3. Add API route tests for event validation rules.
4. Add Playwright coverage for the full create/edit/delete flow.
5. Use failing tests to drive missing auth, modal accessibility, and error-state improvements.
