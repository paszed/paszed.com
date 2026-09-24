import Script from "next/script";

import type { Schema } from "../types";

interface JsonLdProps {
  id: string;
  data: Schema | readonly Schema[];
}

export function serializeJsonLd(data: JsonLdProps["data"]): string {
  const escapedLessThan = `${String.fromCharCode(92)}u003c`;
  return JSON.stringify(data).replace(/</g, escapedLessThan);
}

export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
