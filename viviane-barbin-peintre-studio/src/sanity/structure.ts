import type {StructureResolver} from 'sanity/structure'

/**
 * Custom Studio structure
 * - Exposes two singleton documents with fixed documentId:
 *   - contactSettings
 *   - siteSettings
 * - Exposes the Galeries document list (regular documents, not singletons)
 *
 * Note: you still need to pass this to `structureTool({structure})` in `sanity.config.ts`.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Contact')
        .id('contactSettings')
        .child(
          S.document().schemaType('contactSettings').documentId('contactSettings').title('Contact'),
        ),

      S.listItem()
        .title('Site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site')),

      S.listItem()
        .title('Galeries – Paramètres')
        .id('gallerySettings')
        .child(
          S.document()
            .schemaType('gallerySettings')
            .documentId('gallerySettings')
            .title('Galeries – Paramètres'),
        ),

      S.divider(),

      // Galeries — regular document list (not a singleton)
      S.listItem()
        .title('Galeries')
        .id('galleriesContent')
        .child(
          S.documentTypeList('galleriesContent')
            .title('Galeries')
            .defaultOrdering([{field: 'date', direction: 'desc'}]),
        ),

      S.divider(),

      // Keep the rest of the document types accessible, excluding the singletons and galleries
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['contactSettings', 'siteSettings', 'gallerySettings', 'galleriesContent'].includes(
            listItem.getId() || '',
          ),
      ),
    ])
