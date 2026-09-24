import { brand } from "./brand";

export interface BrandWordmarkProps {
  href?: string;
  className?: string;
}

export function BrandWordmark({
  href = "/",
  className,
}: BrandWordmarkProps) {
  return (
    <a
      href={href}
      aria-label="Paszed home"
      className={`inline-flex font-mono text-[1.05rem] font-medium leading-none tracking-[-0.035em] ${className ?? ""}`}
    >
      <span className="text-fg">{brand.wordmark.slice(0, -1)}</span>
      <span className="text-accent">{brand.wordmark.slice(-1)}</span>
    </a>
  );
}
