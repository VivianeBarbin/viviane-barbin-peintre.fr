/* config/types/navigation.d.ts */
export interface NavLinkItem {
  text: string;
  link: string;
  button?: string;
  newTab?: boolean;
  icon?: string;
  showInDesktopNav?: boolean; // If false, hides from desktop header (still shows in mobile & footer). Defaults to true.
}

export interface LegalLinkItem {
  text: string;
  link: string;
  newTab?: boolean;
  icon?: string;
}

export interface SocialLinkItem {
  text: string;
  link: string;
  newTab?: boolean;
  icon?: string;
}
