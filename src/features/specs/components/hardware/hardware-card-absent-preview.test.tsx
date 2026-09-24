import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/ui", () => ({ Card: () => null }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));

import { HardwareCard } from "./hardware-card";

describe("HardwareCard without a mounted preview", () => {
  it("does not create an observer when the preview element is absent", () => {
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);
    try {
      render(
        <HardwareCard
          name="Mac mini"
          detail="M4 / 16 GB"
          description="Primary development machine."
          model="/models/mac-mini.glb"
        />,
      );
      expect(observer).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
