import {defineField, defineType} from 'sanity'

/**
 * Singleton document: Site settings
 * - Keep favicon/manifest fields as string paths (no asset uploads).
 * - Intended to be opened via a fixed documentId("siteSettings") in structure.
 */
export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slogan',
      title: 'Slogan',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Supports line breaks (e.g. with &\n).',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),

    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Absolute URL of the website (optional).',
    }),
    defineField({
      name: 'base',
      title: 'Base path',
      type: 'string',
      description: 'Base path if the site is served from a subpath (e.g. "/foo").',
    }),
    defineField({
      name: 'startYear',
      title: 'Start year',
      type: 'string',
      description: 'Displayed in copyright (e.g. 2026).',
    }),

    // Favicons / manifest: keep as string paths (no uploads)
    defineField({
      name: 'faviconSvg',
      title: 'Favicon SVG path',
      type: 'string',
      description: 'Example: "/favicon.svg" or "/assets/favicon.svg"',
    }),
    defineField({
      name: 'faviconPng96',
      title: 'Favicon PNG 96x96 path',
      type: 'string',
      description: 'Example: "/favicon-96x96.png"',
    }),
    defineField({
      name: 'faviconPng',
      title: 'Favicon PNG path',
      type: 'string',
      description: 'Example: "/favicon.png"',
    }),
    defineField({
      name: 'faviconIco',
      title: 'Favicon ICO path',
      type: 'string',
      description: 'Example: "/favicon.ico"',
    }),
    defineField({
      name: 'webManifest',
      title: 'Web manifest path',
      type: 'string',
      description: 'Example: "/site.webmanifest"',
    }),
    defineField({
      name: 'appleTouchIcon',
      title: 'Apple touch icon path',
      type: 'string',
      description: 'Example: "/apple-touch-icon.png"',
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title ?? 'Site',
        subtitle: 'Singleton document',
      }
    },
  },
})
