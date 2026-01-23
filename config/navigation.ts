// config/navigation.ts
import type { NavLinkItem, LegalLinkItem } from "./types";

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
  },
];

export const legalLinks: LegalLinkItem[] = [
  {
    text: "Mentions Légales",
    link: "/mentions-legales",
  },
  {
    text: "Politique de confidentialité",
    link: "/politique-confidentialite",
  },
];
