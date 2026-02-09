import { defineField, defineType } from "sanity";

export const contactSettingsType = defineType({
  name: "contactSettings",
  title: "Contact",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone_link",
      title: "Lien téléphone (tel:...)",
      type: "string",
      description: "Ex: tel:+33643826269",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (typeof value !== "string") return "Doit être une chaîne de caractères.";
          if (!value.startsWith("tel:")) return "Doit commencer par 'tel:'.";
          return true;
        }),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (typeof value !== "string") return "Doit être une chaîne de caractères.";
          // validation légère (la validation stricte d'email peut être trop restrictive)
          if (!value.includes("@")) return "Doit contenir '@'.";
          return true;
        }),
    }),
    defineField({
      name: "website",
      title: "Site web",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "address",
      title: "Adresse",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Rue",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city",
          title: "Ville",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "postalCode",
          title: "Code postal",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "region",
          title: "Région / Département",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "country",
          title: "Pays",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "businessHours",
      title: "Horaires",
      type: "object",
      fields: [
        defineField({
          name: "weekdays",
          title: "Semaine",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "saturday",
          title: "Samedi",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "sunday",
          title: "Dimanche",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact",
        subtitle: "Réglages (singleton)",
      };
    },
  },
});
