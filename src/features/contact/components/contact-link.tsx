"use client";

import { trackContactCta } from "@/analytics";

interface ContactLinkProps {
  href: string;
  target: string;
  className: string;
  children: React.ReactNode;
}

export function ContactLink({ href, target, className, children }: ContactLinkProps) {
  return (
    <a
      data-analytics-id={`contact.${target}`}
      href={href}
      onClick={() => trackContactCta(target)}
      className={className}
    >
      {children}
    </a>
  );
}
