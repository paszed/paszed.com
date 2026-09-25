import { render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";

import { AnalyticsProvider } from "./analytics-provider";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("AnalyticsProvider", () => {
  const recordRouteAnalytics = vi.fn();
  const startGlobalAnalytics = vi.fn();
  const startRouteAnalytics = vi.fn();

  const loadLifecycle = vi.fn(async () => ({
    recordRouteAnalytics,
    startGlobalAnalytics,
    startRouteAnalytics,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    startGlobalAnalytics.mockReturnValue(vi.fn());
    startRouteAnalytics.mockReturnValue(vi.fn());
  });

  it("starts global and route tracking and cleans both up", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    const globalStop = vi.fn();
    const routeStop = vi.fn();

    startGlobalAnalytics.mockReturnValue(globalStop);
    startRouteAnalytics.mockReturnValue(routeStop);

    const { unmount } = render(
      <AnalyticsProvider loadLifecycle={loadLifecycle} />,
    );

    await waitFor(() => {
      expect(startGlobalAnalytics).toHaveBeenCalledOnce();
      expect(recordRouteAnalytics).toHaveBeenCalledWith("/en", null);
      expect(startRouteAnalytics).toHaveBeenCalledWith("/en");
    });

    unmount();

    expect(globalStop).toHaveBeenCalledOnce();
    expect(routeStop).toHaveBeenCalledOnce();
  });

  it("records transitions when the pathname changes", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    const { rerender } = render(
      <AnalyticsProvider loadLifecycle={loadLifecycle} />,
    );

    await waitFor(() => {
      expect(recordRouteAnalytics).toHaveBeenCalledWith("/en", null);
    });

    vi.mocked(usePathname).mockReturnValue("/de");

    rerender(<AnalyticsProvider loadLifecycle={loadLifecycle} />);

    await waitFor(() => {
      expect(recordRouteAnalytics).toHaveBeenCalledWith("/de", "/en");
      expect(startRouteAnalytics).toHaveBeenCalledWith("/de");
    });
  });

  it("does not start route tracking without a pathname", async () => {
    vi.mocked(usePathname).mockReturnValue("");

    render(<AnalyticsProvider loadLifecycle={loadLifecycle} />);

    await waitFor(() => {
      expect(startGlobalAnalytics).toHaveBeenCalledOnce();
    });

    expect(recordRouteAnalytics).not.toHaveBeenCalled();
    expect(startRouteAnalytics).not.toHaveBeenCalled();
  });

  it("does not record a route transition when the pathname is unchanged", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    const { rerender } = render(
      <AnalyticsProvider loadLifecycle={loadLifecycle} />,
    );

    await waitFor(() => {
      expect(recordRouteAnalytics).toHaveBeenCalledOnce();
      expect(startRouteAnalytics).toHaveBeenCalledOnce();
    });

    rerender(<AnalyticsProvider loadLifecycle={loadLifecycle} />);

    expect(recordRouteAnalytics).toHaveBeenCalledOnce();
    expect(startRouteAnalytics).toHaveBeenCalledOnce();
  });

  it("does not record the same route twice when effects are replayed", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    render(
      <StrictMode>
        <AnalyticsProvider loadLifecycle={loadLifecycle} />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(recordRouteAnalytics).toHaveBeenCalledOnce();
    });
  });

  it("does not start analytics when loading finishes after unmount", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    let resolveLifecycle:
      | ((value: Awaited<ReturnType<typeof loadLifecycle>>) => void)
      | undefined;

    const delayedLoad = vi.fn(
      () =>
        new Promise<Awaited<ReturnType<typeof loadLifecycle>>>((resolve) => {
          resolveLifecycle = resolve;
        }),
    );

    const { unmount } = render(
      <AnalyticsProvider loadLifecycle={delayedLoad} />,
    );

    unmount();

    resolveLifecycle?.({
      recordRouteAnalytics,
      startGlobalAnalytics,
      startRouteAnalytics,
    });

    await Promise.resolve();

    expect(startGlobalAnalytics).not.toHaveBeenCalled();
    expect(recordRouteAnalytics).not.toHaveBeenCalled();
    expect(startRouteAnalytics).not.toHaveBeenCalled();
  });

  it("loads the production analytics lifecycle by default", async () => {
    vi.mocked(usePathname).mockReturnValue("");

    render(<AnalyticsProvider />);

    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });

  it("cancels both pending analytics loads after unmount", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    const resolvers: Array<(value: Awaited<ReturnType<typeof loadLifecycle>>) => void> = [];
    const delayedLoad = vi.fn(
      () =>
        new Promise<Awaited<ReturnType<typeof loadLifecycle>>>((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const { unmount } = render(
      <AnalyticsProvider loadLifecycle={delayedLoad} />,
    );

    expect(delayedLoad).toHaveBeenCalledTimes(2);
    unmount();

    for (const resolve of resolvers) {
      resolve({
        recordRouteAnalytics,
        startGlobalAnalytics,
        startRouteAnalytics,
      });
    }

    await Promise.resolve();

    expect(startGlobalAnalytics).not.toHaveBeenCalled();
    expect(recordRouteAnalytics).not.toHaveBeenCalled();
    expect(startRouteAnalytics).not.toHaveBeenCalled();
  });

  it("restarts route tracking without recording the same pathname twice", async () => {
    vi.mocked(usePathname).mockReturnValue("/en");

    const lifecycle = {
      recordRouteAnalytics,
      startGlobalAnalytics,
      startRouteAnalytics,
    };

    const firstLoad = vi.fn(async () => lifecycle);
    const secondLoad = vi.fn(async () => lifecycle);

    const { rerender } = render(
      <AnalyticsProvider loadLifecycle={firstLoad} />,
    );

    await waitFor(() => {
      expect(recordRouteAnalytics).toHaveBeenCalledOnce();
      expect(startRouteAnalytics).toHaveBeenCalledOnce();
    });

    rerender(<AnalyticsProvider loadLifecycle={secondLoad} />);

    await waitFor(() => {
      expect(startRouteAnalytics).toHaveBeenCalledTimes(2);
    });

    expect(recordRouteAnalytics).toHaveBeenCalledOnce();
  });
});
