import type { HomeContent } from "@/features/home/types/home";

export const huHome: HomeContent = {
  hero: {
    eyebrow: "EDVARD PASZ / SZOFTVERFEJLESZTŐ",
    title: "Olyan szoftvert építek,",
    titleEmphasis: "amely valódi munkát végez",
    description:
      "Webalkalmazások, belső rendszerek és automatizáció. A felhasználói felülettől az infrastruktúráig.",
    primaryCta: {
      label: "Projekt megbeszélése",
      href: "/contact",
    },
  },

  introduction: {
    eyebrow: "A munkáról",
    statement: "A felhasználói felület csak",
    statementEmphasis: "egy része a rendszernek",
    description: "Frontenddel, backenddel, architektúrával és integrációkkal foglalkozom. A célom, hogy a teljes rendszer működjön – ne csak az a része, amit a felhasználó lát.",
  },

  capabilities: {
    eyebrow: "Amit építek",
    title: "Rendszerek, amelyek",
    titleEmphasis: "valódi munkát végeznek",
    description: "Ügyféloldali termékektől az őket működtető rendszerekig.",
    items: [
      {
        title: "Termékek",
        description: "Webalkalmazások és platformok a felhasználói felülettől a háttérszolgáltatásokig.",
      },
      {
        title: "Rendszerek",
        description: "Belső eszközök, amelyek egy helyre hozzák az adatokat és a munkafolyamatokat.",
      },
      {
        title: "Automatizáció",
        description: "Integrációk és automatizált munkafolyamatok, amelyek összekötik az eszközöket és kiváltják az ismétlődő lépéseket.",
      },
    ],
  },

  work: {
    eyebrow: "Kiemelt munkák",
    title: "Megépítve, nem csak elképzelve",
    items: [
    {
      title: "Foundation.js",
      description: "Technikai alap következetes szerkezettel, eszközökkel és konvenciókkal a szoftverépítéshez.",
      href: "/projects/foundation-js",
      category: "Engineering · Foundation",
    },
    {
      title: "paszed.com",
      description: "Ez a webhely, amelyet szoftverrendszerként építettem meg, nem statikus portfólióként.",
      href: "/projects/paszed-com",
      category: "Személyes · Platform",
    },
  ],

  },


  approach: {
    eyebrow: "Ahogy dolgozom",
    title: "Megérteni. Megépíteni.",
    titleEmphasis: "Szállítani",
    description: "A probléma megértésétől a használatra kész szoftverig.",
    items: [
      {
        title: "Megérteni",
        description: "Tisztázni a problémát, a korlátokat és azt, hogy mit kell a szoftvernek megoldania.",
      },
      {
        title: "Megépíteni",
        description: "A megoldást átlátható felépítéssel, karbantartható kóddal és megfelelő eszközökkel megvalósítani.",
      },
      {
        title: "Szállítani",
        description: "Üzembe helyezni a szoftvert, ellenőrizni a működését, és használatra kész állapotban átadni.",
      },
    ],
  },

  contact: {
    eyebrow: "Kapcsolat",
    title: "Van egy probléma,",
    titleEmphasis: "amire érdemes építeni?",
    description: "Mondd el, mit szeretnél megépíteni, javítani vagy automatizálni.",
    cta: {
      label: "Projekt megbeszélése",
      href: "mailto:edvard@paszed.com",
    },
  },
};
