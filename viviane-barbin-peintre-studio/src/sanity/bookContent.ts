// ./src/sanity/bookContent.ts
import {defineField, defineType} from 'sanity'

export const bookContentType = defineType({
  name: 'bookContent',
  title: 'Mon Livre',
  type: 'document',
  icon: () => '📖',
  description: 'Contenu de la page "Mon livre" avec texte et images.',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Titre de la page',
      type: 'string',
      description: 'Titre principal affiché en haut de la page.',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      description: "Texte riche avec possibilité d'ajouter des images.",
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
                    validation: (Rule) =>
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
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Describe the image for accessibility and SEO. (Required)',
              validation: (Rule) => Rule.required().error('Alt text is mandatory for all images.'),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'layout',
              type: 'string',
              title: 'Image Layout',
              description: 'Choose how this image will be displayed on the page.',
              options: {
                list: [
                  {title: 'Centered (Default)', value: 'centered'},
                  {title: 'Full Width', value: 'fullWidth'},
                  {title: 'Float Left', value: 'floatLeft'},
                  {title: 'Float Right', value: 'floatRight'},
                ],
                layout: 'radio',
              },
              initialValue: 'centered',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'pdfFile',
      title: 'Fichier PDF',
      description: 'PDF associé au livre.',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'resellerLink',
      title: 'Lien vers un revendeur',
      type: 'object',
      description: 'Lien externe vers une plateforme où acheter le livre.',
      fields: [
        {
          name: 'label',
          type: 'string',
          title: 'Texte du bouton',
          description: 'Ex: "leslibraires.fr" ou "Disponible sur Amazon"',
          validation: (Rule) => Rule.required().max(60),
        },
        {
          name: 'url',
          type: 'url',
          title: 'URL',
          validation: (Rule) =>
            Rule.required().uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'openInNewTab',
          type: 'boolean',
          title: 'Ouvrir dans un nouvel onglet',
          initialValue: true,
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'subtitle',
    },
    prepare({title}) {
      return {
        title: title || 'Mon Livre',
        subtitle: 'Page du livre',
      }
    },
  },
})
