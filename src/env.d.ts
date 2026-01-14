/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}
