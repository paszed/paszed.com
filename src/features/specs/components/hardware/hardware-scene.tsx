"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { HardwareModel } from "./hardware-model";

interface HardwareSceneProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function HardwareScene({
  src,
  scale,
  position,
  rotation,
}: HardwareSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3, 2, 4], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 5, 3]} intensity={3.2} />
      <directionalLight position={[-4, 2, -2]} intensity={1.4} />
      <directionalLight position={[0, -2, 4]} intensity={0.8} />

      <Suspense fallback={null}>
        <HardwareModel
          src={src}
          scale={scale}
          position={position}
          rotation={rotation}
        />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
      />
    </Canvas>
  );
}
