import type { IconType } from "react-icons";
import { Orbit } from "lucide-react";
import {
  SiCloudflare,
  SiDocker,
  SiFishshell,
  SiGithub,
  SiNodedotjs,
  SiNextdotjs,
  SiNeovim,
  SiPnpm,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import {
  TbBrandGit,
  TbCloud,
  TbDatabase,
  TbPackage,
  TbPencil,
  TbSparkles,
  TbTerminal2,
  TbTopologyStar3,
} from "react-icons/tb";
import type { TechnologyIconName } from "../../types";
import { cn } from "@/lib/utils";

interface TechnologyIconProps {
  name: string;
  className?: string;
}

const icons: Record<TechnologyIconName, IconType> = {
  TypeScript: SiTypescript,
  "Next.js": SiNextdotjs,
  React: SiReact,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  pnpm: SiPnpm,
  Ghostty: TbTerminal2,
  Fish: SiFishshell,
  Neovim: SiNeovim,
  Unix: TbTerminal2,
  Homebrew: TbPackage,
  Git: TbBrandGit,
  GitHub: SiGithub,
  Supabase: TbDatabase,
  Vercel: TbCloud,
  Cloudflare: SiCloudflare,
  Docker: SiDocker,
  Stripe: SiStripe,
  ChatGPT: TbSparkles,
  Claude: TbSparkles,
  Figma: TbPencil,
  Excalidraw: TbTopologyStar3,
  Motion: Orbit,
};

export function TechnologyIcon({ name, className }: TechnologyIconProps) {
  const Icon = icons[name as TechnologyIconName];
  if (!Icon) return null;

  return (
    <Icon
      aria-hidden
      focusable="false"
      className={cn("size-5 shrink-0", className)}
    />
  );
}
