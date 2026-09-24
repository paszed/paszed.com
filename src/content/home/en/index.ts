import type { HomeContent } from "@/features/home/types/home";

export const enHome: HomeContent = {
  hero: {
    eyebrow: "EDVARD PASZ / SOFTWARE ENGINEER",
    title: "I build software that",
    titleEmphasis: "does real work",
    description:
      "Web applications, internal systems, and automation. From the interface to the infrastructure.",
    primaryCta: {
      label: "Discuss a project",
      href: "/contact",
    },
  },

  introduction: {
    eyebrow: "About the work",
    statement: "The interface is only",
    statementEmphasis: "part of the system",
    description: "I work across frontend, backend, architecture, and integrations. The goal is to make the whole system work—not just the part people see.",
  },

  capabilities: {
    eyebrow: "What I build",
    title: "Systems that",
    titleEmphasis: "do something",
    description: "From customer-facing products to the machinery behind them.",
    items: [
      {
        title: "Products",
        description: "Web applications and platforms, from the interface to the backend services that run them.",
      },
      {
        title: "Systems",
        description: "Internal tools that bring data, workflows, and scattered processes into one place.",
      },
      {
        title: "Automation",
        description: "Integrations and automated workflows that connect tools and eliminate repetitive steps.",
      },
    ],
  },

  work: {
    eyebrow: "Selected work",
    title: "Built, not imagined",
    items: [
    {
      title: "Foundation.js",
      description: "An engineering foundation for building software with consistent structure, tooling, and conventions.",
      href: "/projects/foundation-js",
      category: "Engineering · Foundation",
    },
    {
      title: "paszed.com",
      description: "This site, built as a software system rather than a static portfolio.",
      href: "/projects/paszed-com",
      category: "Personal · Platform",
    },
    ],
  },

  approach: {
    eyebrow: "How I work",
    title: "Understand. Build.",
    titleEmphasis: "Ship",
    description: "From the initial problem to working software.",
    items: [
      {
        title: "Understand",
        description: "Define the problem, the constraints, and what the software needs to accomplish.",
      },
      {
        title: "Build",
        description: "Develop the solution with clear boundaries, maintainable code, and appropriate tooling.",
      },
      {
        title: "Ship",
        description: "Deploy the software, verify that it works, and make it ready for use.",
      },
    ],
  },

  contact: {
    eyebrow: "Get in touch",
    title: "Have a problem worth",
    titleEmphasis: "building around?",
    description: "Tell me what you're trying to build, fix, or automate.",
    cta: {
      label: "Discuss a project",
      href: "mailto:edvard@paszed.com",
    },
  },
};
