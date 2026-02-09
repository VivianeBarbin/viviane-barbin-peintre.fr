import { defineField, defineType } from "sanity";

/**
 * Gallery document schema.
 *
 * Each document represents a single gallery (e.g. a collection of paintings
 * grouped by medium, date, or theme).
 *
 * These are **not** singletons — every gallery is its own document with a
 * unique slug so Astro can generate static pages at `/galeries/:slug`.
 */
export const galleriesContentType = defineType({
  name: "galleriesContent",
  title: "Galeries",
  type: "document",
  icon: () => "🖌️",
  fields: [
    // ── Core fields ──────────────────────────────────────────────────

    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: "Nom de la galerie (ex : « Pastels d'automne 2024 »)",
      validation: (Rule) => Rule.required().max(120),
    }),

    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description:
        "Identifiant unique utilisé dans l'URL (/galeries/mon-slug). Générer à partir du titre.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Date principale de la galerie (utilisée pour le tri et l'affichage MM/AA).",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "medium",
      title: "Technique(s) / Medium(s)",
      type: "array",
      description:
        "Technique(s) artistique(s) de cette galerie. Sélectionnez une ou plusieurs valeurs.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Pastel", value: "PASTEL" },
          { title: "Aquarelle", value: "AQUARELLE" },
          { title: "Huile sur toile", value: "HUILE_SUR_TOILE" },
          { title: "Huile sur bois", value: "HUILE_SUR_BOIS" },
          { title: "Acrylique", value: "ACRYLIQUE" },
          { title: "Encre", value: "ENCRE" },
          { title: "Fusain", value: "FUSAIN" },
          { title: "Crayon", value: "CRAYON" },
          { title: "Technique mixte", value: "TECHNIQUE_MIXTE" },
          { title: "Autre", value: "AUTRE" },
        ],
      },
      validation: (Rule) => Rule.required().min(1).error("Sélectionnez au moins une technique."),
    }),

    // ── Cover image ──────────────────────────────────────────────────

    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      description:
        "Image affichée dans la liste des galeries. Formats recommandés : jpg, png, webp.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          description: "Description de l'image pour l'accessibilité.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ── Gallery images ───────────────────────────────────────────────

    defineField({
      name: "images",
      title: "Images de la galerie",
      type: "array",
      description:
        "Toutes les images de cette galerie. Vous pouvez les réordonner par glisser-déposer.",
      of: [
        {
          type: "object",
          name: "galleryImage",
          title: "Image",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              description: "Description de l'image pour l'accessibilité.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Légende (optionnelle)",
              type: "string",
              description: "Légende affichée sous l'image (titre de l'œuvre, dimensions, etc.).",
            }),
            defineField({
              name: "order",
              title: "Ordre (optionnel)",
              type: "number",
              description: "Ordre d'affichage. Si vide, l'ordre du tableau est utilisé.",
            }),
          ],
          preview: {
            select: {
              title: "alt",
              subtitle: "caption",
              media: "image",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Image sans texte alternatif",
                subtitle: subtitle || "",
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error("La galerie doit contenir au moins une image."),
    }),

    // ── Optional body / description ──────────────────────────────────

    defineField({
      name: "body",
      title: "Description / Texte d'introduction",
      type: "array",
      description: "Texte optionnel affiché en haut de la page de détail de la galerie.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre H3", value: "h3" },
            { title: "Citation", value: "blockquote" },
          ],
          lists: [
            { title: "Puces", value: "bullet" },
            { title: "Numérotée", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Lien",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],

  // ── Studio preview ─────────────────────────────────────────────────

  orderings: [
    {
      title: "Date (récent en premier)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Date (ancien en premier)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Titre A → Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      date: "date",
      medium: "medium",
      media: "coverImage",
      imageCount: "images",
    },
    prepare({ title, date, medium, media, imageCount }) {
      const count = Array.isArray(imageCount) ? imageCount.length : 0;
      const dateStr = date
        ? new Intl.DateTimeFormat("fr-FR", {
            month: "2-digit",
            year: "2-digit",
          }).format(new Date(date))
        : "Date non définie";

      const mediumLabels: Record<string, string> = {
        PASTEL: "Pastel",
        AQUARELLE: "Aquarelle",
        HUILE_SUR_TOILE: "Huile sur toile",
        HUILE_SUR_BOIS: "Huile sur bois",
        ACRYLIQUE: "Acrylique",
        ENCRE: "Encre",
        FUSAIN: "Fusain",
        CRAYON: "Crayon",
        TECHNIQUE_MIXTE: "Technique mixte",
        AUTRE: "Autre",
      };

      const mediumLabel = Array.isArray(medium)
        ? medium.map((m: string) => mediumLabels[m] ?? m).join(", ")
        : "";

      return {
        title: title || "Galerie sans titre",
        subtitle: `${dateStr} · ${mediumLabel || "Aucune technique"} · ${count} image${count > 1 ? "s" : ""}`,
        media,
      };
    },
  },
});
