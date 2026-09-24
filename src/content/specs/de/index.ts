import type { SpecsContent } from "@/features/specs/types";

export const deSpecs: SpecsContent = {
  contact: {
    eyebrow: "Zusammenarbeit",
    title: "Du hast etwas",
    titleEmphasis: "vor?",
    description: "Erzähl mir, was du bauen möchtest. Gemeinsam klären wir, was dafür nötig ist.",
  },
  eyebrow: "Spezifikationen",
  title: "Die Werkzeuge",
  titleEmphasis: "hinter der Arbeit",
  description:
     "Was ich zum Bauen, Schreiben, Denken und Ausliefern nutze.",
  updated: "September 2026",
  hardware: {
    eyebrow: "Hardware",
    title: "Die Maschinen,",
    titleEmphasis: "mit denen ich arbeite",
    description: "Die Hardware, die ich zum Bauen, Testen und Denken nutze.",
    items: [
    {
      name: "Mac mini M4",
      detail: "16 GB Unified Memory",
      description: "Die Maschine, auf der alles beginnt.",
      model: "/models/mac-mini-m4.glb",
    },
    {
      name: "iPhone 17 Pro",
      detail: "Primäres Mobilgerät",
      description: "Tests, Fotografie, Kommunikation und alles dazwischen.",
      image: "/images/specs/iphone-17-pro.webp",
      model: "/models/iphone-17-pro.glb",
    },
    {
      name: "iPad Pro M4",
      detail: "Sekundäres Gerät",
      description: "Lesen, Referenzmaterial und Arbeiten abseits des Schreibtischs.",
      image: "/images/specs/ipad-pro-m4.webp",
      model: "/models/ipad-pro-m4.glb",
    },
  ],
  },
  sections: [
    {
      id: "development",eyebrow: "Werkzeuge",
      title: "Entwicklung",
      description: "Der Stack, mit dem ich entwickle.",
      items: [
        { name: "TypeScript", description: "Die Sprache unter dem Großteil der Arbeit.", icon: "TypeScript" },
        { name: "Next.js", description: "Das Framework hinter dem Großteil meiner Webentwicklung.", icon: "Next.js" },
        { name: "React", description: "Die Interface-Schicht.", icon: "React" },
        { name: "Tailwind CSS", description: "Die Styling-Schicht.", icon: "Tailwind CSS" },
        { name: "Node.js", description: "Runtime für Anwendungen und Werkzeuge.", icon: "Node.js" },
        { name: "pnpm", description: "Paketverwaltung und Workspaces.", icon: "pnpm" },
      ],
    },
    {
      id: "terminal",eyebrow: "Entwicklung",
      title: "Terminal & System",
      description: "Hier findet der Großteil der Arbeit statt.",
      items: [
        { name: "Ghostty", description: "Mein Terminal.", icon: "Ghostty" },
        { name: "fish", description: "Meine Shell.", icon: "Fish" },
        { name: "Neovim", description: "Mein Editor.", icon: "Neovim" },
        { name: "Unix", description: "Die Umgebung unter dem Workflow.", icon: "Unix" },
        { name: "Homebrew", description: "Systempakete unter macOS.", icon: "Homebrew" },
        { name: "Git", description: "Versionskontrolle und Historie.", icon: "Git" },
      ],
    },
    {
      id: "infrastructure",eyebrow: "Infrastruktur",
      title: "Infrastruktur",
      description: "Die Infrastruktur, die Software in die Welt bringt.",
      items: [
        { name: "GitHub", description: "Repositories, Zusammenarbeit und Versionskontrolle.", icon: "GitHub", href: "https://github.com/paszed" },
        { name: "Supabase", description: "Datenbank, Auth, Storage und Backend-Dienste.", icon: "Supabase" },
        { name: "Vercel", description: "Deployment und Hosting.", icon: "Vercel" },
        { name: "Cloudflare", description: "DNS, Edge-Infrastruktur und Netzwerkdienste.", icon: "Cloudflare" },
        { name: "Docker", description: "Container und reproduzierbare Umgebungen.", icon: "Docker" },
        { name: "Stripe", description: "Zahlungs- und Abrechnungsinfrastruktur.", icon: "Stripe" },
      ],
    },
    {
      id: "ai-design",
      eyebrow: "KI",
      title: "KI",
      description: "Werkzeuge zum Denken und Gestalten.",
      items: [
        { name: "ChatGPT", description: "Recherche, Analyse und Entwicklung.", icon: "ChatGPT" },
      ],
    },
  ],
  workflow: {
    eyebrow: "Arbeitsweise",
        title: "Wie ich arbeite",
    items: [
      "Mit dem Terminal beginnen.",
      "Die langweiligen Teile automatisieren.",
      "Kleine Werkzeuge bevorzugen, die eine Sache gut machen.",
      "Die Umgebung reproduzierbar halten.",
      "Werkzeuge hinzufügen, wenn das Problem immer wieder auftaucht.",
    ],
  },
};
