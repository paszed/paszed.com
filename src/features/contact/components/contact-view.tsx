import { ContactLink } from "./contact-link";
import type { ContactContent } from "../types";

interface ContactViewProps {
  content: ContactContent;
}

export function ContactView({ content }: ContactViewProps) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid max-w-4xl gap-12 border-t border-border pt-8 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
              {content.emailLabel}
            </p>
            <ContactLink
              href={`mailto:${content.email}`}
              target="email-address"
              className="mt-4 inline-block text-xl font-medium tracking-tight transition-colors hover:text-accent sm:text-2xl"
            >
              {content.email}
            </ContactLink>
          </div>

          <div>
            <p className="text-sm leading-7 text-fg-secondary">
              {content.availability}
            </p>
            <ContactLink
              href={`mailto:${content.email}`}
              target="send-email"
              className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              {content.sendEmailLabel}
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
