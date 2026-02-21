declare module "litelight-js" {
  export interface LitelightOptions {
    imageSelector?: string;
    imageUrlAttribute?: string;
    swipeThreshold?: number;
    fadeAnimationDuration?: number;
  }

  export function init(options?: LitelightOptions): void;
}

declare module "litelight-js/css" {}
