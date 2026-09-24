import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./theme-provider";

const mocks = vi.hoisted(() => ({
  provider: vi.fn(),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: (props: {
    attribute: string;
    defaultTheme: string;
    enableSystem: boolean;
    disableTransitionOnChange: boolean;
    children: React.ReactNode;
  }) => {
    mocks.provider(props);
    return <div data-testid="next-themes-provider">{props.children}</div>;
  },
}));

describe("ThemeProvider", () => {
  it("passes its configuration and children to next-themes", () => {
    render(
      <ThemeProvider>
        <span>Child content</span>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("next-themes-provider")).toHaveTextContent(
      "Child content",
    );
    expect(mocks.provider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: true,
      }),
    );
  });
});
