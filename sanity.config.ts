import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// Vite statically replaces `process.env.SANITY_STUDIO_*` at build time.
// This declaration satisfies TypeScript without pulling in all of @types/node.
declare const process: { env: Record<string, string | undefined> };

// ---------------------------------------------------------------------------
// Dataset selection (env-driven)
// ---------------------------------------------------------------------------
// Sanity Studio exposes env vars prefixed with SANITY_STUDIO_ to the client
// bundle at build time (Vite static replacement).
//
// • Local dev  : no env var needed → defaults to "local_dev"
// • Production : set SANITY_STUDIO_DATASET=production in the build environment
// • Preview    : set SANITY_STUDIO_DATASET=staging (or local_dev) explicitly
//
// See .env.example for the full list of variables.
// ---------------------------------------------------------------------------
const dataset: string = process.env.SANITY_STUDIO_DATASET ?? "local_dev";

const singletonTypes = new Set(["contactSettings", "siteSettings"]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Contact")
        .child(
          S.document().schemaType("contactSettings").documentId("contactSettings").title("Contact")
        ),
      S.listItem()
        .title("Site")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() ?? "")
      ),
    ]);

export default defineConfig({
  name: "default",
  title: "viviane-barbin-peintre-studio",

  projectId: "x31r8s87",
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,

    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },

  document: {
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(
          ({ action }) =>
            action === "publish" || action === "discardChanges" || action === "restore"
        );
      }
      return prev;
    },
  },
});
