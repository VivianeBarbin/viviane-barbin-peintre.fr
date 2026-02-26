// ./src/sanity/workshopContent.ts
import {defineField, defineType} from 'sanity'

export const workshopContentType = defineType({
  name: 'workshopContent',
  title: "L'atelier",
  type: 'document',
  icon: () => '🔥',
  description: 'Contenu de la page "L\'atelier" avec texte, images et témoignages.',

  preview: {
    select: {
      title: 'subtitle',
      testimonials: 'testimonialsSection.testimonials',
    },
    prepare({title, testimonials}) {
      const count = Array.isArray(testimonials) ? testimonials.length : 0
      return {
        title: title || "L'atelier",
        subtitle: count ? `${count} témoignage${count > 1 ? 's' : ''}` : 'Aucun témoignage',
      }
    },
  },

  fields: [
    // ─────────────────────────────
    // PAGE TITLE
    // ─────────────────────────────
    defineField({
      name: 'subtitle',
      title: 'Titre principal',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),

    // ─────────────────────────────
    // INTRO SECTION
    // ─────────────────────────────
    defineField({
      name: 'introSection',
      title: "Section d'introduction",
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: {
                  previews: [
                    {title: 'Carré (1:1)', aspectRatio: 1},
                    {title: 'Rectangle (9:5)', aspectRatio: 9 / 5},
                    {title: 'Rectangle (13:28)', aspectRatio: 13 / 20},
                  ],
                },
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texte alternatif',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'text',
              title: 'Texte',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'Heading 3', value: 'h3'},
                    {title: 'Heading 4', value: 'h4'},
                    {title: 'Quote', value: 'blockquote'},
                  ],
                  lists: [
                    {title: 'Bullet list', value: 'bullet'},
                    {title: 'Numbered list', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Bold', value: 'strong'},
                      {title: 'Italic', value: 'em'},
                      {title: 'Underline', value: 'underline'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule: any) =>
                              Rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
                            initialValue: false,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'cta',
              title: 'Bouton (optionnel)',
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Texte du bouton',
                  type: 'string',
                  validation: (Rule) => Rule.max(60),
                }),
                defineField({
                  name: 'url',
                  title: 'Lien',
                  type: 'url',
                  validation: (Rule) =>
                    Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel'],
                    }),
                }),
                defineField({
                  name: 'openInNewTab',
                  title: 'Ouvrir dans un nouvel onglet',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
            }),
          ],
          preview: {
            select: {media: 'image'},
          },
        },
      ],
    }),

    // ─────────────────────────────
    // TESTIMONIALS SLIDER
    // ─────────────────────────────
    defineField({
      name: 'testimonialsSection',
      title: 'Section Témoignages',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Titre de la section',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        }),

        defineField({
          name: 'sectionIntro',
          title: 'Introduction de la section',
          type: 'text',
          rows: 3,
          description: 'Courte accroche affichée sous le titre.',
          validation: (Rule) => Rule.max(300),
        }),

        defineField({
          name: 'cta',
          title: 'Bouton (optionnel)',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Texte du bouton',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: 'url',
              title: 'Lien',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Ouvrir dans un nouvel onglet',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        }),

        defineField({
          name: 'testimonials',
          title: 'Témoignages',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'testimonial',
              title: 'Témoignage',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Photo',
                  type: 'image',
                  options: {
                    hotspot: {
                      previews: [
                        {title: 'Carré (1:1)', aspectRatio: 1},
                        {title: 'Rectangle (9:5)', aspectRatio: 9 / 5},
                        {title: 'Rectangle (13:28)', aspectRatio: 13 / 20},
                      ],
                    },
                  },
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Texte alternatif',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  validation: (Rule) => Rule.required(),
                }),

                defineField({
                  name: 'quote',
                  title: 'Texte du témoignage',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required().max(500),
                }),

                defineField({
                  name: 'firstName',
                  title: 'Prénom',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(50),
                }),

                defineField({
                  name: 'lastName',
                  title: 'Nom',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(50),
                }),

                defineField({
                  name: 'profession',
                  title: 'Profession / Situation',
                  type: 'string',
                  description: 'Ex: Peintre en acrylique, Illustrateur, etc.',
                  validation: (Rule) => Rule.required().max(100),
                }),
              ],

              preview: {
                select: {
                  title: 'firstName',
                  lastName: 'lastName',
                  profession: 'profession',
                  media: 'image',
                },
                prepare({title, lastName, profession, media}) {
                  const fullName = `${title || ''} ${lastName || ''}`.trim()
                  return {
                    title: fullName || 'Témoignage',
                    subtitle: profession || 'Sans profession',
                    media,
                  }
                },
              },
            },
          ],
          validation: (Rule) => Rule.max(10).warning('Limiter à 10 témoignages maximum'),
        }),
      ],
    }),
  ],
})
