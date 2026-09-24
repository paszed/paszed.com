import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/analytics/core/handler", () => ({
  handleAnalyticsPost: vi.fn(),
}));
import { handleAnalyticsPost } from "@/analytics/core/handler";
import { POST } from "./route";

describe("analytics API route", () => {
  it("exports the analytics POST handler directly", () => {
    expect(POST).toBe(handleAnalyticsPost);
  });
});
