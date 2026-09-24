import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { brand } from "./brand";
import { BrandWordmark } from "./brand-wordmark";

describe("BrandWordmark", () => {
  it("renders the default home link and split wordmark", () => {
    render(<BrandWordmark />);
    const link = screen.getByRole("link", { name: "Paszed home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass("inline-flex");
    expect(link).toHaveTextContent(brand.wordmark);
    expect(link.querySelectorAll("span")[0]).toHaveTextContent(brand.wordmark.slice(0, -1));
    expect(link.querySelectorAll("span")[1]).toHaveTextContent(brand.wordmark.slice(-1));
  });

  it("accepts a localized href and custom className", () => {
    render(<BrandWordmark href="/de" className="custom-wordmark" />);
    expect(screen.getByRole("link", { name: "Paszed home" }))
      .toHaveAttribute("href", "/de");
    expect(screen.getByRole("link", { name: "Paszed home" }))
      .toHaveClass("custom-wordmark");
  });
});
