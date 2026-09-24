import { Mail } from "lucide-react";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import {
  SiDiscord,
  SiGithub,
  SiReddit,
  SiX,
} from "react-icons/si";
import { cn } from "@/lib/utils";

interface SocialIconProps {
  name: string;
  className?: string;
}

const icons: Record<string, IconType | typeof Mail> = {
  GitHub: SiGithub,
  LinkedIn: FaLinkedin,
  X: SiX,
  Reddit: SiReddit,
  Discord: SiDiscord,
  Email: Mail,
};

const colors: Record<string, string> = {
  GitHub: "group-hover:text-fg",
  LinkedIn: "group-hover:text-[#0A66C2]",
  X: "group-hover:text-fg",
  Reddit: "group-hover:text-[#FF4500]",
  Discord: "group-hover:text-[#5865F2]",
  Email: "group-hover:text-accent",
};

export function SocialIcon({ name, className }: SocialIconProps) {
  const Icon = icons[name];
  if (!Icon) return null;

  return (
    <Icon
      className={cn("transition-colors duration-200", colors[name], className)}
      aria-hidden="true"
    />
  );
}
