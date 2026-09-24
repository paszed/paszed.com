import type { AboutContent } from "@/features/about/types";

export const enAbout: AboutContent = {
  eyebrow: "About",
  title: "Edvard Pasz — Software Engineer",
  introduction:
    "I build web applications, backend systems, and developer tools, with an interest in how the entire system fits together.",
  profile: {
    name: "Edvard Pasz",
    role: "Software engineer / Builder",
    bio: [
      "I build web applications, backend systems, and developer tools. I’m interested in how the pieces fit together — from the interface people use to the infrastructure behind it.",
      "I prefer working through a problem, testing ideas, and understanding the trade-offs before committing to an architecture.",
    ],
  },
  perspective: {
    eyebrow: "Perspective",
    lead: "I want to understand",
    emphasis: "the whole system",
    description:
      "The interface, the data, the architecture, the infrastructure — and the decisions connecting them. Each part changes what the others can do.",
  },
  work: {
    eyebrow: "The work",
    title: "Build it. Understand it. Make it better.",
    lead: "Build it. Understand it.",
    emphasis: "Make it better",
    paragraphs: [
      "My work moves between products, internal systems, developer tooling, and automation. I’m interested in the connections between them, not just the individual features.",
      "I like turning an unclear problem into something concrete: a working implementation that can be tested, questioned, and improved.",
    ],
  },
  principle: {
    eyebrow: "Engineering",
    lead: "Complexity has to",
    emphasis: "earn its place",
    description:
      "Every abstraction, dependency, and moving part should solve a real problem. Keep ownership clear, make the source of truth explicit, and introduce complexity only when the system needs it.",
  },
  contact: {
    eyebrow: "Work with me",
    title: "Need someone who thinks beyond the interface?",
    lead: "Need someone who thinks",
    emphasis: "beyond the interface?",
    description: "Tell me what you’re building and where you’re stuck. I’ll take a look at the problem with you.",
    cta: "Discuss a project",
  },
};
