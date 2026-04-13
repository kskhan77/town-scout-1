import { render, screen } from "@testing-library/react";
import { LandmarkCard } from "@/components/molecules/LandmarkCard";

describe("LandmarkCard", () => {
  it("renders the title and all tags", () => {
    render(
      <LandmarkCard
        imageSrc="/test.png"
        title="Old Town Hall"
        tags={["Built 1892", "Historic Registry", "Free Entry"]}
      />
    );
    expect(screen.getByText("Old Town Hall")).toBeInTheDocument();
    expect(screen.getByText("Built 1892")).toBeInTheDocument();
    expect(screen.getByText("Historic Registry")).toBeInTheDocument();
    expect(screen.getByText("Free Entry")).toBeInTheDocument();
  });
});
