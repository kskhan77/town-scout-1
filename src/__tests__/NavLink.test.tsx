import { render, screen } from "@testing-library/react";
import { NavLink } from "@/components/atoms/NavLink";

describe("NavLink", () => {
  it("renders the label and points to the correct href", () => {
    render(<NavLink href="/events">Events</NavLink>);
    const link = screen.getByRole("link", { name: "Events" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/events");
  });
});
