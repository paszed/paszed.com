export interface FooterContent {
  brand: {
    description: string;
  };

  navigation: {
    title: string;
    labels: {
      projects: string;
      about: string;
      specs: string;
    };
  };

  social: {
    title: string;
    ariaLabel: string;
  };

  bottom: {
    copyright: string;
    tagline: string;
  };
}
