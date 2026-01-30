// config/navigation.ts
import type { NavLinkItem, LegalLinkItem, SocialLinkItem } from "./types";

export const navigationLinks: NavLinkItem[] = [
  {
    text: "Galerie",
    link: "/galerie",
  },
  {
    text: "Mon livre",
    link: "/mon-livre",
  },
  {
    text: "À propos",
    link: "/a-propos",
  },
  {
    text: "L'atelier",
    link: "/atelier",
  },
  {
    text: "Contact",
    link: "/contact",
  }
];

export const legalLinks: LegalLinkItem[] = [
  {
    text: "Mentions Légales",
    link: "/mentions-legales",
  },
  {
    text: "Confidentialité",
    link: "/politique-confidentialite",
  }
];

export const socialLinks: SocialLinkItem[] = [
  {
    text: "Facebook",
    link: "https://www.facebook.com/viviane.barbin.9"
  },
  {
    text: "Bourgogne Tourisme",
    link: "https://www.bourgogne-tourisme.com/locations-de-vacances/chez-viviani"
  }
];
