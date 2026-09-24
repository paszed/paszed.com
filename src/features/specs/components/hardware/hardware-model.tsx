"use client";

import { Bounds, Center, useGLTF } from "@react-three/drei";

interface HardwareModelProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function HardwareModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: HardwareModelProps) {
  const { scene } = useGLTF(src);

  return (
    <Bounds fit clip observe margin={1.5}>
      <Center>
        <primitive
          object={scene}
          scale={scale}
          position={position}
          rotation={rotation}
        />
      </Center>
    </Bounds>
  );
}

