import { render, screen } from "@testing-library/react";
import { EventCard, type EventItem } from "@/components/molecules/EventCard";

const mockEvent: EventItem = {
  id: "1",
  title: "Super Awesome Dayz",
  date: "2026-06-04T12:00:00.000Z",
  location: "Chevy Commons",
  description: "Cool party for cool people",
};

describe("EventCard", () => {
  it("renders the event title, location, and description", () => {
    render(
      <EventCard event={mockEvent} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("Super Awesome Dayz")).toBeInTheDocument();
    expect(screen.getByText("Chevy Commons")).toBeInTheDocument();
    expect(screen.getByText("Cool party for cool people")).toBeInTheDocument();
  });
});
