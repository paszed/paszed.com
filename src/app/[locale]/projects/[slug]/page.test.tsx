import { describe, expect, it, vi } from "vitest";
import { notFound } from "next/navigation";
import ProjectPage, { generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

describe("project detail placeholder route", () => {
  it("does not generate project routes", () => {
    expect(generateStaticParams()).toEqual([]);
  });

  it("invokes notFound", () => {
    ProjectPage();
    expect(notFound).toHaveBeenCalledOnce();
  });
});
