import { defineField, defineType,  } from "sanity";
import type { FieldDefinition } from "sanity";

// Type for block children spans
interface BlockChild {
  _type?: string;
  text?: string;
}

interface BlockContent {
  _type?: string;
  children?: BlockChild[];
}

// Helper to create typed paragraph fields
const paragraphField = (
  name: string,
  title: string,
  description: string
): FieldDefinition =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [
      {
        type: "block",
        styles: [{ title: "Paragraph", value: "normal" }],
        lists: [],
        marks: {
          decorators: [],
          annotations: [],
        },
      },
    ],
    validation: (Rule) =>
      Rule.required().custom((blocks: unknown) => {
        if (!blocks || !Array.isArray(blocks))
          return "Ce champ est requis";

        // Require at least some non-whitespace text somewhere in the blocks
        const hasSomeText = blocks.some((block: unknown) => {
          const blockContent = block as BlockContent;
          if (blockContent?._type !== "block") return false;
          
          const text = Array.isArray(blockContent.children)
            ? blockContent.children
                .map((c: BlockChild) =>
                  typeof c?.text === "string" ? c.text : ""
                )
                .join("")
                .trim()
            : "";
          return text.length > 0;
        });

        return hasSomeText
          ? true
          : "Veuillez écrire au moins un paragraphe (texte non vide)";
      }),
  });

export const aboutContentType = defineType({
  name: "aboutContent",
  title: "About Content",
  type: "document",
  description: 'Page d\'accueil - Section "À propos"',
  fields: [
    defineField({
      name: "title",
      title: "TITRE DE SECTION",
      type: "string",
      description:
        'H2 - 60 caractères max. Ex : "Biographie", "Qui suis-je ", etc...',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: "image",
      title: "IMAGE / PORTRAIT",
      type: "image",
      description:
        "formats recommandés : jpg, png, jpeg, webp, avif - dimensions recommandées : 720*900px - 1080*1350px",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "texte alternatif",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    paragraphField(
      "topText",
      "Paragraphe 1 (haut)",
      "Texte affiché au-dessus de l'image."
    ),
    paragraphField(
      "imageText",
      "Paragraphe 2 (à côté de l'image)",
      "Texte affiché à côté de l'image."
    ),
    paragraphField(
      "bottomText",
      "Paragraphe 3 (bas)",
      "Texte affiché sous le bloc image."
    ),
  ],

  preview: {
    select: {
      title: "title",
      topText: "topText",
      imageText: "imageText",
      bottomText: "bottomText",
      media: "image",
    },
    prepare({ title, topText, imageText, bottomText, media }) {
      const countNonEmpty = (blocks: unknown): number => {
        if (!Array.isArray(blocks)) return 0;
        return blocks.some((block: unknown) => {
          const blockContent = block as BlockContent;
          if (blockContent?._type !== "block") return false;
          
          const text = Array.isArray(blockContent.children)
            ? blockContent.children
                .map((c: BlockChild) =>
                  typeof c?.text === "string" ? c.text : ""
                )
                .join("")
                .trim()
            : "";
          return text.length > 0;
        })
          ? 1
          : 0;
      };

      const filled =
        countNonEmpty(topText) +
        countNonEmpty(imageText) +
        countNonEmpty(bottomText);

      return {
        title: title || "About section",
        subtitle: `${filled}/3 paragraphes remplis`,
        media,
      };
    },
  },
});
