import { defineField, defineType } from "sanity";

export const homeContent = defineType({
  name: "homeContent",
  title: "Page d'Accueil",
  type: "document",

  fields: [
    defineField({
      name: "siteTitle",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "atelierImage",
      title: "Image de l'Atelier",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          description: "Description de l'image pour l'accessibilité",
        },
      ],
    }),
    defineField({
      name: "paintingImage",
      title: "Image de Peinture",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          description: "Description de l'image pour l'accessibilité",
        },
      ],
    }),
  ],
});
