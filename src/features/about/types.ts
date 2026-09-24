export interface AboutContent {
  eyebrow: string;
  title: string;
  introduction: string;
  profile: {
    name: string;
    role: string;
    bio: readonly string[];
  };
  perspective: {
    eyebrow: string;
    lead: string;
    emphasis: string;
    description: string;
  };
  work: {
    eyebrow: string;
    title: string;
    lead: string;
    emphasis: string;
    paragraphs: readonly string[];
  };
  principle: {
    eyebrow: string;
    lead: string;
    emphasis: string;
    description: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    emphasis: string;
    description: string;
    cta: string;
  };
}
