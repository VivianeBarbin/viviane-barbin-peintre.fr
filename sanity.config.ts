import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

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
  dataset: "local_dev",

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
