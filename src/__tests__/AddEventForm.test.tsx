import { render, screen } from "@testing-library/react";
import { AddEventForm } from "@/components/organisms/AddEventForm";

describe("AddEventForm", () => {
  it("renders all input fields and the submit button", () => {
    render(<AddEventForm loading={false} error="" onSubmit={jest.fn()} />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Date & Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Event" })).toBeInTheDocument();
  });
});
