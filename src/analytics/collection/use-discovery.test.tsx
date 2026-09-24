import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDiscovery } from "./use-discovery";

function DiscoveryElement({ target }: { target: string }) {
  const ref = useDiscovery({ type: "specs_view", target });
  return <section ref={ref} data-testid="discovery" />;
}

function EmptyDiscoveryElement() {
  useDiscovery({ type: "offer_view", target: "unattached" });
  return null;
}

describe("useDiscovery", () => {
  it("sets and updates discovery attributes", () => {
    const { rerender } = render(<DiscoveryElement target="first" />);
    const element = screen.getByTestId("discovery");
    expect(element).toHaveAttribute("data-analytics-discovery", "first");
    expect(element).toHaveAttribute("data-analytics-discovery-type", "specs_view");
    rerender(<DiscoveryElement target="second" />);
    expect(element).toHaveAttribute("data-analytics-discovery", "second");
  });

  it("handles an unattached ref", () => {
    expect(() => render(<EmptyDiscoveryElement />)).not.toThrow();
  });
});
