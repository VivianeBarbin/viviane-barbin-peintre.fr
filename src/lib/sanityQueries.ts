/**
 * GROQ queries used by the frontend to fetch content from Sanity.
 *
 * Strategy:
 * - Singleton documents (contactSettings, siteSettings) are fetched by fixed document ID.
 * - Collection documents (galleriesContent) are fetched as lists or by slug.
 *
 * These queries intentionally only return the fields needed by the frontend
 * (no assets for favicons/manifest; those are plain string paths).
 */

export const CONTACT_SETTINGS_QUERY = /* groq */ `
*[_type == "contactSettings" && _id == "contactSettings"][0]{
  phone,
  phone_link,
  email,
  website,
  address{
    street,
    city,
    postalCode,
    region,
    country
  },
  businessHours{
    weekdays,
    saturday,
    sunday
  }
}
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  slogan,
  subtitle,
  description,
  author,
  url,
  base,
  startYear,

  // Favicons/manifest: keep as string paths
  faviconSvg,
  faviconPng96,
  faviconPng,
  faviconIco,
  webManifest,
  appleTouchIcon
}
`;

// ── Home ─────────────────────────────────────────────────────────────

/**
 * Query for the homepage hero / features section.
 * Returns the singleton homeContent document with dereferenced image assets.
 */
export const HOME_CONTENT_QUERY = /* groq */ `
*[_type == "homeContent"][0]{
  siteTitle,
  description,
  atelierImage{
    asset->{_id, url, metadata { dimensions }},
    alt
  },
  paintingImage{
    asset->{_id, url, metadata { dimensions }},
    alt
  }
}
`;

// ── About ────────────────────────────────────────────────────────────

/**
 * Query for the "À propos" / biography section.
 * Returns the singleton aboutContent document with image + Portable Text fields.
 */
export const ABOUT_CONTENT_QUERY = /* groq */ `
*[_type == "aboutContent"][0]{
  title,
  image{
    asset->{_id, url, metadata { dimensions }},
    alt
  },
  topText,
  imageText,
  bottomText
}
`;

// ── News ─────────────────────────────────────────────────────────────

/**
 * Query for the "Actualités" section.
 * Returns the singleton newsContent document with its array of news items.
 */
export const NEWS_CONTENT_QUERY = /* groq */ `
*[_type == "newsContent"][0]{
  sectionTitle,
  news[]{
    eventType,
    eventTitle,
    eventDate,
    eventEndDate,
    eventTime,
    eventLocation,
    eventAddress,
    eventImage{
      asset->{_id, url, metadata},
      alt,
      hotspot,
      crop
    },
    eventLink
  }
}
`;

// ── Galleries ────────────────────────────────────────────────────────

/**
 * List query for `/galeries` index page.
 * Returns all galleries sorted by date (most recent first).
 * Only projects the fields needed for the card grid.
 */
export const GALLERIES_LIST_QUERY = /* groq */ `
*[_type == "galleriesContent"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  date,
  medium,
  coverImage{
    asset->{_id, url, metadata { dimensions }},
    alt,
    hotspot,
    crop
  }
}
`;

/**
 * Slugs query for `getStaticPaths()`.
 * Returns only the slug string for each gallery document.
 */
export const GALLERY_SLUGS_QUERY = /* groq */ `
*[_type == "galleriesContent" && defined(slug.current)]{
  "slug": slug.current
}
`;

/**
 * Detail query for `/galeries/:slug`.
 * Returns all fields needed for the gallery detail page,
 * including the full images array with dereferenced assets.
 */
export const GALLERY_DETAIL_QUERY = /* groq */ `
*[_type == "galleriesContent" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  date,
  medium,
  coverImage{
    asset->{_id, url, metadata { dimensions }},
    alt,
    hotspot,
    crop
  },
  images[]{
    _key,
    image{
      asset->{_id, url, metadata { dimensions }},
      hotspot,
      crop
    },
    alt,
    caption,
    order
  },
  body
}
`;
