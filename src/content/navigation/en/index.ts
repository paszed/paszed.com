import type { NavigationContent } from "@/types/navigation";

export const enNavigation: NavigationContent = {
  accessibility: {
    primaryNavigation: "Primary navigation",
  },
  items: {
    projects: { label: "Projects" },
    about: { label: "About" },
    specs: { label: "Specs" },
  },
  actions: {
    contact: "Start a conversation",
    contactShort: "Contact",
  },
};
