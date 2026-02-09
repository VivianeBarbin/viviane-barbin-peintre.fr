import type { DocumentActionComponent, DocumentActionsResolver } from "sanity";

/**
 * Centralized singleton configuration.
 *
 * These schema types are intended to be edited as singletons (one document each),
 * opened via a fixed `documentId()` in the Studio structure.
 */
export const singletonSchemaTypes = new Set(["contactSettings", "siteSettings"]);

/**
 * Limit actions for singleton documents to "safe" actions only.
 *
 * Keeps:
 * - publish
 * - discardChanges
 * - restore
 *
 * Filters out:
 * - delete, duplicate, unpublish, etc.
 */
export const singletonDocumentActions: DocumentActionsResolver = (prev, context) => {
  const schemaType = context.schemaType;

  if (!singletonSchemaTypes.has(schemaType)) return prev;

  const allowed = new Set(["publish", "discardChanges", "restore"]);

  return prev.filter((item) => {
    // Sanity actions can be either strings or action components depending on version/setup.
    if (typeof item === "string") return allowed.has(item);

    const action = (item as DocumentActionComponent & { action?: string }).action;
    return typeof action === "string" ? allowed.has(action) : true;
  });
};
