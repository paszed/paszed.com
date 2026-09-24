import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import {
  recordRouteAnalytics,
  startGlobalAnalytics,
  startRouteAnalytics,
} from "@/analytics/collection/lifecycle";
import { AnalyticsProvider } from "./analytics-provider";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("@/analytics/collection/lifecycle", () => ({
  recordRouteAnalytics: vi.fn(),
  startGlobalAnalytics: vi.fn(),
  startRouteAnalytics: vi.fn(),
}));

describe("AnalyticsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(startGlobalAnalytics).mockReturnValue(vi.fn());
    vi.mocked(startRouteAnalytics).mockReturnValue(vi.fn());
  });

  it("starts global and route tracking and cleans both up", () => {
    vi.mocked(usePathname).mockReturnValue("/en");
    const { unmount } = render(<AnalyticsProvider />);
    expect(startGlobalAnalytics).toHaveBeenCalledOnce();
    expect(recordRouteAnalytics).toHaveBeenCalledWith("/en", null);
    expect(startRouteAnalytics).toHaveBeenCalledWith("/en");
    const globalStop = vi.mocked(startGlobalAnalytics).mock.results[0]?.value;
    const routeStop = vi.mocked(startRouteAnalytics).mock.results[0]?.value;
    unmount();
    expect(globalStop).toHaveBeenCalledOnce();
    expect(routeStop).toHaveBeenCalledOnce();
  });

  it("records transitions when the pathname changes", () => {
    vi.mocked(usePathname).mockReturnValue("/en");
    const { rerender } = render(<AnalyticsProvider />);
    vi.mocked(usePathname).mockReturnValue("/de");
    rerender(<AnalyticsProvider />);
    expect(recordRouteAnalytics).toHaveBeenCalledWith("/de", "/en");
    expect(startRouteAnalytics).toHaveBeenCalledWith("/de");
  });

  it("does not start route tracking without a pathname", () => {
    vi.mocked(usePathname).mockReturnValue("");
    render(<AnalyticsProvider />);
    expect(recordRouteAnalytics).not.toHaveBeenCalled();
    expect(startRouteAnalytics).not.toHaveBeenCalled();
  });

  it("does not record a route transition when the pathname is unchanged", () => {
    vi.mocked(usePathname).mockReturnValue("/en");
    const { rerender } = render(<AnalyticsProvider />);
    expect(recordRouteAnalytics).toHaveBeenCalledOnce();
    rerender(<AnalyticsProvider />);
    expect(recordRouteAnalytics).toHaveBeenCalledOnce();
    expect(startRouteAnalytics).toHaveBeenCalledOnce();
  });





it("does not record the same route twice when effects are replayed", async () => {
const { StrictMode } = await import("react");
vi.mocked(usePathname).mockReturnValue("/en");

render(
<StrictMode>
<AnalyticsProvider />
</StrictMode>,
);

expect(recordRouteAnalytics).toHaveBeenCalledOnce();
});

});
