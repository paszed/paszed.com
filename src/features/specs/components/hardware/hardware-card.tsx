"use client";

import { useEffect, useRef, useState } from "react";

import { Card } from "@/ui";
import type { SpecHardwareItem } from "../../types";
import dynamic from "next/dynamic";

const HardwareScene = dynamic(
  () => import("./hardware-scene").then((module) => module.HardwareScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center font-mono text-xs uppercase tracking-[0.16em] text-fg-muted justify-center">
        Loading 3D model…
      </div>
    ),
  },
);

type HardwareCardProps = SpecHardwareItem;

export function HardwareCard({
  name,
  detail,
  description,
  model,
  modelScale,
  modelPosition,
  modelRotation,
}: HardwareCardProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [shouldLoadModel, setShouldLoadModel] = useState(false);

  useEffect(() => {
    if (!model || shouldLoadModel) return;

    const element = previewRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoadModel(true);
        observer.disconnect();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [model, shouldLoadModel]);

  return (
    <Card className="group">
      <div
        ref={previewRef}
        className="relative min-h-72 overflow-hidden border-b border-border bg-background sm:min-h-80"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(128,128,128,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.12)_1px,transparent_1px)] [background-size:32px_32px]"
        />

        {model && shouldLoadModel ? (
          <HardwareScene
            src={model}
            scale={modelScale}
            position={modelPosition}
            rotation={modelRotation}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">
            {model ? "3D model loading on view" : "3D model"}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">
          {detail}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-fg-secondary">
          {description}
        </p>
      </div>
    </Card>
  );
}
