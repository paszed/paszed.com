import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HardwareScene } from "./hardware-scene";

const modelMock = vi.fn();

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, dpr, camera, gl, className }: {
    children: React.ReactNode;
    dpr: number[];
    camera: { position: number[]; fov: number };
    gl: { alpha: boolean; antialias: boolean };
    className: string;
  }) => (
    <div
      data-testid="canvas"
      data-dpr={JSON.stringify(dpr)}
      data-camera={JSON.stringify(camera)}
      data-gl={JSON.stringify(gl)}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: (props: {
    enableZoom: boolean;
    enablePan: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    minPolarAngle: number;
    maxPolarAngle: number;
  }) => (
    <div data-testid="orbit-controls" data-config={JSON.stringify(props)} />
  ),
}));

vi.mock("./hardware-model", () => ({
  HardwareModel: (props: {
    src: string;
    scale?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
  }) => {
    modelMock(props);
    return <div data-testid="hardware-model" data-src={props.src} />;
  },
}));

describe("HardwareScene", () => {
  it("configures the canvas, lighting, and orbit controls", () => {
    const { container } = render(<HardwareScene src="/models/mac-mini.glb" />);

    const canvas = screen.getByTestId("canvas");
    expect(JSON.parse(canvas.getAttribute("data-dpr") ?? "null")).toEqual([1, 2]);
    expect(JSON.parse(canvas.getAttribute("data-camera") ?? "null")).toEqual({
      position: [3, 2, 4],
      fov: 35,
    });
    expect(JSON.parse(canvas.getAttribute("data-gl") ?? "null")).toEqual({
      alpha: true,
      antialias: true,
    });
    expect(canvas).toHaveClass("!absolute", "inset-0");
    expect(container.querySelectorAll("ambientlight")).toHaveLength(1);
    expect(container.querySelectorAll("directionallight")).toHaveLength(3);

    const controls = JSON.parse(
      screen.getByTestId("orbit-controls").getAttribute("data-config") ?? "null",
    );
    expect(controls).toEqual({
      enableZoom: false,
      enablePan: false,
      enableDamping: true,
      dampingFactor: 0.08,
      autoRotate: true,
      autoRotateSpeed: 0.55,
      minPolarAngle: Math.PI / 3,
      maxPolarAngle: (Math.PI * 2) / 3,
    });
  });

  it("forwards model configuration to HardwareModel", () => {
    const position: [number, number, number] = [1, 2, 3];
    const rotation: [number, number, number] = [0, 1, 0];

    render(
      <HardwareScene
        src="/models/display.glb"
        scale={1.25}
        position={position}
        rotation={rotation}
      />,
    );

    expect(screen.getByTestId("hardware-model")).toHaveAttribute(
      "data-src", "/models/display.glb",
    );
    expect(modelMock).toHaveBeenCalledWith({
      src: "/models/display.glb",
      scale: 1.25,
      position,
      rotation,
    });
  });
});
