import type { AttributifyAttributes } from "unocss/preset-attributify";

declare global {
  namespace astroHTML.JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}
