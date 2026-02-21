import {aboutContentType} from '../src/sanity/aboutContent'
import {contactSettingsType} from '../src/sanity/contactSettings'
import {galleriesContentType} from '../src/sanity/galleriesContent'
import {gallerySettingsType} from '../src/sanity/gallerySettings'
import {homeContent} from '../src/sanity/homeContent'
import {newsContentType} from '../src/sanity/newsContent'
import {siteSettingsType} from '../src/sanity/siteSettings'

export const schemaTypes = [
  aboutContentType,
  galleriesContentType,
  gallerySettingsType,
  homeContent,
  newsContentType,
  contactSettingsType,
  siteSettingsType,
  // Add other schema types here
]
