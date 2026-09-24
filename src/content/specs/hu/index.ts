import type { SpecsContent } from "@/features/specs/types";

export const huSpecs: SpecsContent = {
  contact: {
    eyebrow: "Dolgozzunk együtt",
    title: "Van valami,",
    titleEmphasis: "amit megépítenél?",
    description: "Írd meg, mit szeretnél építeni. Együtt tisztázhatjuk, mire van szükség.",
  },
  eyebrow: "Specifikációk",
  title: "A munka mögött álló",
  titleEmphasis: "eszközök",
  description:
     "Amiket építéshez, íráshoz, gondolkodáshoz és szállításhoz használok.",
  updated: "September 2026",
  hardware: {
    eyebrow: "Hardver",
    title: "A gépek,",
    titleEmphasis: "amelyeken dolgozom",
    description: "A hardver, amelyet építéshez, teszteléshez és gondolkodáshoz használok.",
    items: [
    {
      name: "Mac mini M4",
      detail: "16 GB unified memory",
      description: "A gép, amelyen minden elkezdődik.",
      model: "/models/mac-mini-m4.glb",
    },
    {
      name: "iPhone 17 Pro",
      detail: "Elsődleges mobil eszköz",
      description: "Tesztelés, fotózás, kommunikáció és minden, ami ezek között van.",
      image: "/images/specs/iphone-17-pro.webp",
      model: "/models/iphone-17-pro.glb",
    },
    {
      name: "iPad Pro M4",
      detail: "Másodlagos eszköz",
      description: "Olvasás, referenciaanyag és munka az asztaltól távol.",
      image: "/images/specs/ipad-pro-m4.webp",
      model: "/models/ipad-pro-m4.glb",
    },
  ],
  },
  sections: [
    {
      id: "development",eyebrow: "Eszközök",
      title: "Fejlesztés",
      description: "A stack, amellyel fejlesztek.",
      items: [
        { name: "TypeScript", description: "A legtöbb munka alapjául szolgáló nyelv.", icon: "TypeScript" },
        { name: "Next.js", description: "A legtöbb webes munkám mögött álló framework.", icon: "Next.js" },
        { name: "React", description: "Az interfészréteg.", icon: "React" },
        { name: "Tailwind CSS", description: "A stílusréteg.", icon: "Tailwind CSS" },
        { name: "Node.js", description: "Runtime alkalmazásokhoz és eszközökhöz.", icon: "Node.js" },
        { name: "pnpm", description: "Csomagkezelés és workspace-ek.", icon: "pnpm" },
      ],
    },
    {
      id: "terminal",eyebrow: "Fejlesztés",
      title: "Terminál és rendszer",
      description: "A munka nagy része itt történik.",
      items: [
        { name: "Ghostty", description: "A terminálom.", icon: "Ghostty" },
        { name: "fish", description: "A shell-em.", icon: "Fish" },
        { name: "Neovim", description: "A szerkesztőm.", icon: "Neovim" },
        { name: "Unix", description: "A workflow alapjául szolgáló környezet.", icon: "Unix" },
        { name: "Homebrew", description: "Rendszercsomagok macOS-en.", icon: "Homebrew" },
        { name: "Git", description: "Verziókezelés és előzmények.", icon: "Git" },
      ],
    },
    {
      id: "infrastructure",eyebrow: "Infrastruktúra",
      title: "Infrastruktúra",
      description: "Az infrastruktúra, amely eljuttatja a szoftvert a felhasználókhoz.",
      items: [
        { name: "GitHub", description: "Repository-k, együttműködés és verziókezelés.", icon: "GitHub", href: "https://github.com/paszed" },
        { name: "Supabase", description: "Adatbázis, hitelesítés, tárhely és backend szolgáltatások.", icon: "Supabase" },
        { name: "Vercel", description: "Telepítés és hosting.", icon: "Vercel" },
        { name: "Cloudflare", description: "DNS, edge infrastruktúra és hálózati szolgáltatások.", icon: "Cloudflare" },
        { name: "Docker", description: "Konténerek és reprodukálható környezetek.", icon: "Docker" },
        { name: "Stripe", description: "Fizetési és számlázási infrastruktúra.", icon: "Stripe" },
      ],
    },
    {
      id: "ai-design",
      eyebrow: "AI",
      title: "AI",
      description: "Eszközök gondolkodáshoz és alkotáshoz.",
      items: [
        { name: "ChatGPT", description: "Kutatás, gondolkodás és fejlesztés.", icon: "ChatGPT" },
      ],
    },
  ],
  workflow: {
    eyebrow: "Munkafolyamat",
        title: "Ahogy dolgozom",
    items: [
      "A terminállal kezdek.",
      "Automatizálom az unalmas részeket.",
      "Azokat a kis eszközöket részesítem előnyben, amelyek egy dolgot jól csinálnak.",
      "Reprodukálhatóan tartom a környezetet.",
      "Eszközöket adok hozzá, amikor egy probléma újra és újra visszatér.",
    ],
  },
};
