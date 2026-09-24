import type { SpecsContent } from "@/features/specs/types";

export const enSpecs: SpecsContent = {
  contact: {
    eyebrow: "Work with me",
    title: "Have something",
    titleEmphasis: "to build?",
    description: "Tell me what you are building. We can work out what it needs.",
  },
  eyebrow: "Specs",
  title: "The tools behind",
  titleEmphasis: "the work",
  description:
    "What I use to build, write, think, and ship.",
  updated: "September 2026",
  hardware: {
    eyebrow: "Hardware",
    title: "The machines",
    titleEmphasis: "I work on",
    description: "The hardware I use to build, test, and think.",
    items: [
    {
      name: "Mac mini M4",
      detail: "16 GB unified memory",
      description: "The machine everything starts on.",
      model: "/models/mac-mini-m4.glb",
    },
    {
      name: "iPhone 17 Pro",
      detail: "Primary mobile device",
      description: "Testing, photography, communication, and everything in between.",
      image: "/images/specs/iphone-17-pro.webp",
      model: "/models/iphone-17-pro.glb",
    },
    {
      name: "iPad Pro M4",
      detail: "Secondary device",
      description: "Reading, reference material, and working away from the desk.",
      image: "/images/specs/ipad-pro-m4.webp",
      model: "/models/ipad-pro-m4.glb",
    },
  ],
  },
  sections: [
    {
      id: "development",eyebrow: "Tools",
      title: "Development",
      description: "The stack I build with.",
      items: [
        { name: "TypeScript", description: "The language underneath most of the work.", icon: "TypeScript" },
        { name: "Next.js", description: "The framework behind most of my web work.", icon: "Next.js" },
        { name: "React", description: "The interface layer.", icon: "React" },
        { name: "Tailwind CSS", description: "The styling layer.", icon: "Tailwind CSS" },
        { name: "Node.js", description: "Runtime for applications and tooling.", icon: "Node.js" },
        { name: "pnpm", description: "Package management and workspaces.", icon: "pnpm" },
      ],
    },
    {
      id: "terminal",eyebrow: "Development",
      title: "Terminal & System",
      description: "Where most of the work happens.",
      items: [
        { name: "Ghostty", description: "My terminal.", icon: "Ghostty" },
        { name: "fish", description: "My shell.", icon: "Fish" },
        { name: "Neovim", description: "My editor.", icon: "Neovim" },
        { name: "Unix", description: "The environment underneath the workflow.", icon: "Unix" },
        { name: "Homebrew", description: "System packages on macOS.", icon: "Homebrew" },
        { name: "Git", description: "Source control and history.", icon: "Git" },
      ],
    },
    {
      id: "infrastructure",eyebrow: "Infrastructure",
      title: "Infrastructure",
      description: "The infrastructure that gets software out the door.",
      items: [
        { name: "GitHub", description: "Repositories, collaboration, and source control.", icon: "GitHub", href: "https://github.com/paszed" },
        { name: "Supabase", description: "Database, auth, storage, and backend services.", icon: "Supabase" },
        { name: "Vercel", description: "Deployment and hosting.", icon: "Vercel" },
        { name: "Cloudflare", description: "DNS, edge infrastructure, and network services.", icon: "Cloudflare" },
        { name: "Docker", description: "Containers and reproducible environments.", icon: "Docker" },
        { name: "Stripe", description: "Payments and billing infrastructure.", icon: "Stripe" },
      ],
    },
    {
      id: "ai-design",
      eyebrow: "AI",
      title: "AI",
      description: "Tools for thinking and making.",
      items: [
        { name: "ChatGPT", description: "Research, reasoning, and development.", icon: "ChatGPT" },
      ],
    },
  ],
  workflow: {
    eyebrow: "Workflow",
        title: "How I work",
    items: [
      "Start with the terminal.",
      "Automate the boring parts.",
      "Prefer small tools that do one thing well.",
      "Keep the environment reproducible.",
      "Add tools when the problem keeps coming back.",
    ],
  },
};
