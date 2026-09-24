import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JsonLd, serializeJsonLd } from "./json-ld";

vi.mock("next/script", () => ({
  default: (props: {
    id: string;
    type: string;
    dangerouslySetInnerHTML: { __html: string };
  }) => (
    <script
      id={props.id}
      type={props.type}
      dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
    />
  ),
}));

describe("JsonLd", () => {
  it("renders a JSON-LD script with the supplied ID and serialized data", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Edvard Pasz",
    };

    const { container } = render(<JsonLd id="person-schema" data={data} />);
    const script = container.querySelector("script#person-schema");

    expect(script).toHaveAttribute("type", "application/ld+json");
    expect(script?.textContent).toBe(serializeJsonLd(data));
    expect(JSON.parse(script?.textContent ?? "")).toEqual(data);
  });

  it("renders an array of schemas and escapes less-than characters", () => {
    const data = [
      { "@type": "Person", name: "<script>" },
      { "@type": "WebSite", name: "Paszed" },
    ];

    const { container } = render(<JsonLd id="combined-schema" data={data} />);
    const script = container.querySelector("script#combined-schema");

    expect(script?.textContent).not.toContain("<script>");
    expect(script?.textContent).toBe(serializeJsonLd(data));
    expect(JSON.parse(script?.textContent ?? "")).toEqual(data);
  });
});
