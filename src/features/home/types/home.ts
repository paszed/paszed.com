export interface HomeHero {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
}

export interface HomeSectionItem {
  title: string;
  description: string;
}

export interface HomeSection {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  description: string;
  items: readonly HomeSectionItem[];
}

export interface HomeWorkItem {
  title: string;
  description: string;
  href: string;
  category: string;
}

export interface HomeWork {
  eyebrow: string;
  title: string;
  items: readonly HomeWorkItem[];
}

export interface HomeIntroduction {
  eyebrow: string;
  statement: string;
  statementEmphasis: string;
  description: string;
}

export interface HomeContact {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface HomeContent {
  hero: HomeHero;
  introduction: HomeIntroduction;
  capabilities: HomeSection;
  work: HomeWork;
  approach: HomeSection;
  contact: HomeContact;
}
