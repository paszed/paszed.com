interface DropdownCaretProps {
  isOpen: boolean;
  className?: string;
}

export function DropdownCaret({ isOpen, className }: DropdownCaretProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "text-sm leading-none transition-transform duration-200",
        isOpen ? "rotate-180" : "",
        className ?? "",
      ].join(" ")}
    >
      ▾
    </span>
  );
}
