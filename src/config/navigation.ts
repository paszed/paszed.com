import type { NavigationItem } from "@/types/navigation";

export const navigation = [
  {
    id: "projects",
    href: "/projects",
  },
  {
    id: "about",
    href: "/about",
  },
  {
    id: "specs",
    href: "/specs",
  },
] as const satisfies readonly NavigationItem[];
