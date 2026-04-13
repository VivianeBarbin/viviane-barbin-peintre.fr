import { defineField, defineType } from "sanity";
import { GALLERY_MEDIUMS } from "../../../config/galleryMediums";

/**
 * gallerySettings — Singleton document for gallery-wide configuration.
 *
 * Currently exposes:
 * - mediumLabels: lets the editor override the display label of any medium
 *   without a code change. The `value` field (the internal key stored in
 *   galleriesContent.medium) is read-only and pre-populated from the shared
 *   GALLERY_MEDIUMS constant so it always stays in sync.
 *
 * Managed as a singleton via structure.ts + singletons.ts (same pattern as
 * contactSettings / siteSettings).
 */
export const gallerySettingsType = defineType({
  name: "gallerySettings",
  title: "Paramètres",
  type: "document",
  icon: () => "🖼️",

  fields: [
    defineField({
      name: "mediumLabels",
      title: "Labels des médiums",
      type: "array",
      description:
        "Personnalisez les libellés affichés sur le site pour chaque technique. " +
        "Seules les entrées présentes ici surchargent les labels par défaut ; " +
        "les valeurs non listées conservent leur label d'origine.",
      of: [
        {
          type: "object",
          name: "mediumLabel",
          title: "Label",
          fields: [
            defineField({
              name: "value",
              title: "Valeur technique (interne)",
              type: "string",
              description:
                "Clé interne stockée dans les galeries. " +
                "Ne pas modifier — doit correspondre exactement à la liste des médiums.",
              validation: (Rule) =>
                Rule.required().custom((val) => {
                  if (!val) return "Requis";
                  const valid = GALLERY_MEDIUMS.map((m) => m.value as string);
                  return valid.includes(val)
                    ? true
                    : `Valeur inconnue. Valeurs autorisées : ${valid.join(", ")}`;
                }),
            }),
            defineField({
              name: "label",
              title: "Label affiché",
              type: "string",
              description: "Libellé visible sur le site (ex : « Pastel à l'huile », « Huile »).",
              validation: (Rule) => Rule.required().max(80),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "(label vide)",
                subtitle: subtitle ?? "",
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      labels: "mediumLabels",
    },
    prepare({ labels }) {
      const count = Array.isArray(labels) ? labels.length : 0;
      return {
        title: "Paramètres",
        subtitle:
          count > 0
            ? `${count} label${count > 1 ? "s" : ""} personnalisé${count > 1 ? "s" : ""}`
            : "Aucun label personnalisé — labels par défaut actifs",
      };
    },
  },
});
