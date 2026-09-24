
export type TechnologyIconName =
  | "TypeScript"
  | "Next.js"
  | "React"
  | "Tailwind CSS"
  | "Node.js"
  | "pnpm"
  | "Ghostty"
  | "Fish"
  | "Neovim"
  | "Unix"
  | "Homebrew"
  | "Git"
  | "GitHub"
  | "Supabase"
  | "Vercel"
  | "Cloudflare"
  | "Docker"
  | "Stripe"
  | "ChatGPT"
  | "Claude"
  | "Figma"
  | "Excalidraw"
  | "Motion";

export interface SpecTechnologyItem {
  name: string;
  description: string;
  icon: TechnologyIconName;
  detail?: string;
  href?: string;
}

export interface SpecHardwareItem {
  name: string;
  detail: string;
  description: string;
  image?: string;
  model?: string;
  modelScale?: number;
  modelPosition?: [number, number, number];
  modelRotation?: [number, number, number];
}

export interface SpecHardwareSection {
  eyebrow: string;
  title: string;
  titleEmphasis?: string;
  description?: string;
  items: readonly SpecHardwareItem[];
}

export interface SpecSection {
  id: string;
  eyebrow: string;
  title: string;
  titleEmphasis?: string;
  description?: string;
  items: readonly SpecTechnologyItem[];
}

export interface SpecsContent {
  contact: { eyebrow: string; title: string; titleEmphasis: string; description: string; };
  eyebrow: string;
  title: string;
  titleEmphasis?: string;
  description: string;
  updated: string;
  hardware: SpecHardwareSection;
  sections: readonly SpecSection[];
  workflow: {
    eyebrow: string;
    title: string;
    items: readonly string[];
  };
}
