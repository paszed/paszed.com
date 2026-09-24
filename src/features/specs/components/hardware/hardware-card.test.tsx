import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HardwareCard } from "./hardware-card";

const sceneMock = vi.fn();

const dynamicLoadingMock = vi.hoisted(() => ({
  loading: undefined as undefined | (() => React.ReactNode),
  loader: undefined as undefined | (() => Promise<unknown>),
}));

vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    options: { ssr: boolean; loading: () => React.ReactNode },
  ) => {
    dynamicLoadingMock.loading = options.loading;
    dynamicLoadingMock.loader = loader;

    return (props: {
      src: string;
      scale?: number;
      position?: [number, number, number];
      rotation?: [number, number, number];
    }) => {
      sceneMock(props);
      return <div data-testid="hardware-scene" data-src={props.src} />;
    };
  },
}));

interface ObserverInstance {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

const observers: ObserverInstance[] = [];
const originalObserver = globalThis.IntersectionObserver;

const hardware = {
  name: "Mac mini",
  detail: "M4 / 16 GB",
  description: "Primary development machine.",
};

function notifyIntersection(isIntersecting: boolean) {
  const observer = observers[0];
  act(() => {
    observer.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("HardwareCard", () => {
  it("resolves the dynamically imported hardware scene", async () => {
    expect(dynamicLoadingMock.loader).toBeDefined();
    const component = await dynamicLoadingMock.loader?.();
    const { HardwareScene } = await import("./hardware-scene");
    expect(component).toBe(HardwareScene);
  });

  it("provides a loading fallback for the dynamically imported scene", () => {
    expect(dynamicLoadingMock.loading).toBeDefined();
    render(<>{dynamicLoadingMock.loading?.()}</>);
    expect(screen.getByText("Loading 3D model…")).toBeInTheDocument();
  });

  beforeEach(() => {
    observers.length = 0;
    sceneMock.mockClear();

    globalThis.IntersectionObserver = class {
      callback: IntersectionObserverCallback;
      options?: IntersectionObserverInit;
      observe = vi.fn();
      disconnect = vi.fn();

      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        this.callback = callback;
        this.options = options;
        observers.push(this);
      }
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver;
  });

  it("renders hardware information without a model", () => {
    render(<HardwareCard {...hardware} />);

    expect(screen.getByRole("heading", { level: 3, name: "Mac mini" })).toBeInTheDocument();
    expect(screen.getByText("M4 / 16 GB")).toBeInTheDocument();
    expect(screen.getByText("Primary development machine.")).toBeInTheDocument();
    expect(screen.getByText("3D model")).toBeInTheDocument();
    expect(screen.queryByTestId("hardware-scene")).not.toBeInTheDocument();
    expect(observers).toHaveLength(0);
  });

  it("waits until a model card enters the viewport", () => {
    render(<HardwareCard {...hardware} model="/models/mac-mini.glb" />);

    expect(screen.getByText("3D model loading on view")).toBeInTheDocument();
    expect(screen.queryByTestId("hardware-scene")).not.toBeInTheDocument();
    expect(observers).toHaveLength(1);
    expect(observers[0].options).toEqual({ rootMargin: "200px 0px" });
    expect(observers[0].observe).toHaveBeenCalledOnce();
    expect(observers[0].observe.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);

    notifyIntersection(false);
    expect(screen.queryByTestId("hardware-scene")).not.toBeInTheDocument();
    expect(observers[0].disconnect).not.toHaveBeenCalled();
  });

  it("loads the scene on intersection and forwards model configuration", () => {
    const position: [number, number, number] = [1, 2, 3];
    const rotation: [number, number, number] = [0, 1, 0];

    render(
      <HardwareCard
        {...hardware}
        model="/models/mac-mini.glb"
        modelScale={1.5}
        modelPosition={position}
        modelRotation={rotation}
      />,
    );

    notifyIntersection(true);

    expect(screen.getByTestId("hardware-scene")).toHaveAttribute(
      "data-src", "/models/mac-mini.glb",
    );
    expect(screen.queryByText("3D model loading on view")).not.toBeInTheDocument();
    expect(sceneMock).toHaveBeenCalledWith({
      src: "/models/mac-mini.glb",
      scale: 1.5,
      position,
      rotation,
    });
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(observers).toHaveLength(1);
  });

  it("disconnects the observer when the card unmounts", () => {
    const { unmount } = render(
      <HardwareCard {...hardware} model="/models/mac-mini.glb" />,
    );

    expect(observers).toHaveLength(1);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
  });



});
