export type NavigationItemId = "projects" | "about" | "specs";

export interface NavigationItem {
  id: NavigationItemId;
  href: string;
}

export interface NavigationContent {
  items: Record<NavigationItemId, {
    label: string;
  }>; 
  accessibility: {
    primaryNavigation: string;
  };
  actions: {
    contact: string;
    contactShort: string;
  };
}
