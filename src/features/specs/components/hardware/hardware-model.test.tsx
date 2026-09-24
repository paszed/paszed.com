import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGLTF } from "@react-three/drei";
import { HardwareModel } from "./hardware-model";

vi.mock("@react-three/drei", () => ({
  useGLTF: vi.fn(),
  Bounds: ({ children, fit, clip, observe, margin }: {
    children: React.ReactNode;
    fit?: boolean;
    clip?: boolean;
    observe?: boolean;
    margin?: number;
  }) => (
    <div
      data-testid="bounds"
      data-fit={String(fit)}
      data-clip={String(clip)}
      data-observe={String(observe)}
      data-margin={margin}
    >
      {children}
    </div>
  ),
  Center: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="center">{children}</div>
  ),
}));

describe("HardwareModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGLTF).mockReturnValue({
      scene: { name: "Mock GLTF scene" },
    } as ReturnType<typeof useGLTF>);
  });

  it("loads the requested GLTF and applies default transforms", () => {
    const { container } = render(<HardwareModel src="/models/mac-mini.glb" />);

    expect(useGLTF).toHaveBeenCalledExactlyOnceWith("/models/mac-mini.glb");
    expect(screen.getByTestId("bounds")).toHaveAttribute("data-fit", "true");
    expect(screen.getByTestId("bounds")).toHaveAttribute("data-clip", "true");
    expect(screen.getByTestId("bounds")).toHaveAttribute("data-observe", "true");
    expect(screen.getByTestId("bounds")).toHaveAttribute("data-margin", "1.5");
    expect(screen.getByTestId("center")).toBeInTheDocument();

    const primitive = container.querySelector("primitive");
    expect(primitive).not.toBeNull();
    expect(primitive).toHaveAttribute("scale", "1");
    expect(primitive).toHaveAttribute("position", "0,0,0");
    expect(primitive).toHaveAttribute("rotation", "0,0,0");
  });

  it("forwards custom scale, position, and rotation", () => {
    const { container } = render(
      <HardwareModel
        src="/models/display.glb"
        scale={2}
        position={[1, 2, 3]}
        rotation={[0, 1, 0]}
      />,
    );

    expect(useGLTF).toHaveBeenCalledExactlyOnceWith("/models/display.glb");
    const primitive = container.querySelector("primitive");
    expect(primitive).toHaveAttribute("scale", "2");
    expect(primitive).toHaveAttribute("position", "1,2,3");
    expect(primitive).toHaveAttribute("rotation", "0,1,0");
  });
});
