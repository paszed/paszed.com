import type { HomeContent } from "@/features/home/types/home";

export const deHome: HomeContent = {
  hero: {
    eyebrow: "EDVARD PASZ / SOFTWAREENTWICKLER",
    title: "Ich entwickle Software,",
    titleEmphasis: "die echte Arbeit übernimmt",
    description:
      "Webanwendungen, interne Systeme und Automatisierung. Von der Benutzeroberfläche bis zur Infrastruktur.",
    primaryCta: {
      label: "Projekt besprechen",
      href: "/contact",
    },
  },

  introduction: {
    eyebrow: "Über die Arbeit",
    statement: "Die Benutzeroberfläche ist nur",
    statementEmphasis: "ein Teil des Systems",
    description: "Ich arbeite an Frontend, Backend, Architektur und Integrationen. Entscheidend ist, dass das gesamte System funktioniert – nicht nur der sichtbare Teil.",
  },

  capabilities: {
    eyebrow: "Was ich entwickle",
    title: "Systeme, die",
    titleEmphasis: "etwas bewirken",
    description: "Von Produkten für Kunden bis zu den Systemen dahinter.",
    items: [
      {
        title: "Produkte",
        description: "Webanwendungen und Plattformen – von der Benutzeroberfläche bis zu den Backend-Diensten.",
      },
      {
        title: "Systeme",
        description: "Interne Werkzeuge, die Daten und Arbeitsabläufe an einem Ort zusammenführen.",
      },
      {
        title: "Automatisierung",
        description: "Integrationen und automatisierte Abläufe, die Werkzeuge verbinden und wiederkehrende Arbeitsschritte übernehmen.",
      },
    ],
  },

  work: {
    eyebrow: "Ausgewählte Arbeiten",
    title: "Gebaut, nicht nur erdacht",
    items: [
    {
      title: "Foundation.js",
      description: "Ein technisches Fundament für Software mit klarer Struktur, Werkzeugen und Konventionen.",
      href: "/projects/foundation-js",
      category: "Engineering · Foundation",
    },
    {
      title: "paszed.com",
      description: "Diese Website, als Softwaresystem gebaut statt als statisches Portfolio.",
      href: "/projects/paszed-com",
      category: "Persönlich · Plattform",
    },
  ],

  },


  approach: {
    eyebrow: "Wie ich arbeite",
    title: "Verstehen. Bauen.",
    titleEmphasis: "Ausliefern",
    description: "Von der ersten Problemstellung bis zur einsatzbereiten Software.",
    items: [
      {
        title: "Verstehen",
        description: "Das Problem, die Rahmenbedingungen und die Anforderungen an die Software klären.",
      },
      {
        title: "Bauen",
        description: "Die Lösung mit klaren Zuständigkeiten, wartbarem Code und passenden Werkzeugen entwickeln.",
      },
      {
        title: "Ausliefern",
        description: "Die Software bereitstellen, ihre Funktion prüfen und sie für den Einsatz vorbereiten.",
      },
    ],
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Ein Problem, auf dem es",
    titleEmphasis: "sich aufzubauen lohnt?",
    description: "Erzähl mir, was du bauen, verbessern oder automatisieren möchtest.",
    cta: {
      label: "Projekt besprechen",
      href: "mailto:edvard@paszed.com",
    },
  },
};
