import { defineField, defineType } from "sanity";

export const newsContentType = defineType({
  name: "newsContent",
  title: "Actualités",
  type: "document",
  icon: () => "🗞️",
  preview: {
    select: {
      title: "sectionTitle",
      news: "news",
    },
    prepare({ title, news }) {
      const count = Array.isArray(news) ? news.length : 0;
      return {
        title: title || "Actualités",
        subtitle: count ? `${count} actualité${count > 1 ? "s" : ""}` : "Aucune actualité",
      };
    },
  },

  fields: [
    defineField({
      name: "sectionTitle",
      title: "Titre de la section",
      type: "string",
      description: "Ex: Actualités, Événements à venir, etc.",
      initialValue: "Actualités",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "news",
      title: "Liste des actualités",
      type: "array",
      description: "Événements, expositions, publications, etc.",

      of: [
        {
          type: "object",
          name: "newsItem",
          title: "Actualité",

          fields: [
            defineField({
              name: "eventType",
              title: "Type d'événement",
              type: "string",
              options: {
                list: [
                  { title: "Exposition", value: "exposition" },
                  { title: "Publication", value: "publication" },
                  { title: "Conférence", value: "conference" },
                  { title: "Atelier", value: "atelier" },
                  { title: "Résidence", value: "residence" },
                  { title: "Vernissage", value: "vernissage" },
                  { title: "Autre", value: "autre" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "eventTitle",
              title: "Titre de l'événement",
              type: "string",
              validation: (Rule) => Rule.required().max(120),
            }),

            defineField({
              name: "eventDate",
              title: "Date de début",
              type: "date",
              options: { dateFormat: "DD/MM/YYYY" },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "eventEndDate",
              title: "Date de fin (optionnelle)",
              type: "date",
              description: "Laisser vide si l'événement n'a qu'une seule date",
              options: { dateFormat: "DD/MM/YYYY" },
              validation: (Rule) =>
                Rule.min(Rule.valueOfField("eventDate")).warning(
                  "La date de fin devrait être postérieure à la date de début"
                ),
            }),

            defineField({
              name: "eventTime",
              title: "Heure de l'événement (optionnelle)",
              type: "string",
              description: "Format 24h (ex: 14h30, 19h00)",
              validation: (Rule) =>
                Rule.regex(/^\d{1,2}h\d{0,2}$/, {
                  name: "time format",
                  invert: false,
                }).warning('Format attendu: "14h30" ou "19h00"'),
            }),

            defineField({
              name: "eventLocation",
              title: "Lieu",
              type: "string",
              description: "Nom du lieu (ex: Galerie XYZ, Musée ABC)",
              validation: (Rule) => Rule.max(100),
            }),

            defineField({
              name: "eventAddress",
              title: "Adresse",
              type: "text",
              description: "Adresse complète",
              rows: 3,
              validation: (Rule) => Rule.max(200),
            }),

            defineField({
              name: "eventImage",
              title: "Image",
              type: "image",
              options: {
                hotspot: {
                  previews: [
                    { title: "Carré (1:1)", aspectRatio: 1 },
                    { title: "Rectangle (9:5)", aspectRatio: 9 / 5 },
                  ],
                },
              },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Texte alternatif",
                  description: "Description de l'image pour l'accessibilité",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),

            defineField({
              name: "eventLink",
              title: "Lien vers l'événement",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "eventTitle",
              type: "eventType",
              start: "eventDate",
              end: "eventEndDate",
              time: "eventTime",
              location: "eventLocation",
              media: "eventImage",
            },
            prepare({ title, type, start, end, time, location, media }) {
              let dateStr = start || "Date non définie";

              if (start && end) {
                dateStr = `Du ${start} au ${end}`;
              } else if (start && time) {
                dateStr = `Le ${start} à ${time}`;
              } else if (start) {
                dateStr = `Le ${start}`;
              }

              const locationStr = location ? ` • ${location}` : "";

              return {
                title: title || "Sans titre",
                subtitle: `${type || "Type"} • ${dateStr}${locationStr}`,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(20).warning("Limiter à 20 actualités maximum"),
    }),
  ],
});
