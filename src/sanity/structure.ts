import type { StructureResolver } from "sanity/structure";

/**
 * Custom Studio structure
 * - Exposes two singleton documents with fixed documentId:
 *   - contactSettings
 *   - siteSettings
 * - Exposes galleriesContent as a filterable document list
 *
 * Note: you still need to pass this to `structureTool({structure})` in `sanity.config.ts`.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Contact")
        .id("contactSettings")
        .child(
          S.document().schemaType("contactSettings").documentId("contactSettings").title("Contact")
        ),

      S.listItem()
        .title("Site")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site")),

      S.divider(),

      // Galleries: standard document list (not a singleton)
      S.listItem()
        .title("Galeries")
        .id("galleriesContent")
        .child(
          S.documentTypeList("galleriesContent")
            .title("Galeries")
            .defaultOrdering([{ field: "date", direction: "desc" }])
        ),

      S.divider(),

      // Keep the rest of the document types accessible, excluding singletons and galleries
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["contactSettings", "siteSettings", "galleriesContent"].includes(listItem.getId() || "")
      ),
    ]);
