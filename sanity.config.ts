import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./viviane-barbin-peintre-studio/schemaTypes";
import {
  singletonDocumentActions,
  singletonSchemaTypes,
} from "./viviane-barbin-peintre-studio/src/sanity/singletons";
import { structure } from "./viviane-barbin-peintre-studio/src/sanity/structure";

// Vite statically replaces `process.env.SANITY_STUDIO_*` at build time.
// This declaration satisfies TypeScript without pulling in all of @types/node.
declare const process: { env: Record<string, string | undefined> };

// ─── Dataset resolution ───────────────────────────────────────────────
// Sanity Studio (Vite) auto-exposes env vars prefixed with SANITY_STUDIO_
// at build time via process.env replacement.
//
// Local dev  : no env var needed → defaults to "local_dev"
// Production : set SANITY_STUDIO_DATASET=production in the build environment
// Preview    : set SANITY_STUDIO_DATASET=staging (or whichever dataset you want)
//
// See .env.example for the full list of variables.
// ──────────────────────────────────────────────────────────────────────
const dataset = process.env.SANITY_STUDIO_DATASET ?? "local_dev";

export default defineConfig({
  name: "default",
  title: "viviane-barbin-peintre-studio",

  projectId: "x31r8s87",
  dataset,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonSchemaTypes.has(template.schemaType)),
  },

  document: {
    actions: (prev, context) => singletonDocumentActions(prev, context),
  },
});
