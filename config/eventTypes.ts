/**
 * Event Types Configuration
 *
 * Single source of truth for event type labels and values.
 * Used by:
 * - Sanity Studio schema (newsContent.ts)
 * - Frontend component (News.astro)
 */

export interface EventType {
  title: string;
  value: string;
}

export const EVENT_TYPES: EventType[] = [
  // ── Exhibitions & Public Events
  { title: 'Exposition', value: 'exposition' },
  { title: 'Vernissage', value: 'vernissage' },
  { title: 'Festival', value: 'festival' },
  { title: 'Conférence', value: 'conference' },
  { title: 'Atelier', value: 'atelier' },
  { title: 'Résidence', value: 'residence' },

  // ── Publications & Media
  { title: "Publication / Livre d'art", value: 'publication_livre' },
  { title: 'Publication', value: 'publication' },
  { title: 'Article de presse', value: 'article_presse' },
  { title: 'Interview', value: 'interview' },

  // ── Recognition
  { title: 'Prix / Récompense', value: 'prix' },

  // ── Market
  { title: 'Vente aux enchères', value: 'vente_encheres' },
  { title: 'Collection', value: 'collection' },

  // ── Professional
  { title: 'Collaboration', value: 'collaboration' },
  { title: 'Formation', value: 'formation' },

  // ── Fallback
  { title: 'Avenir', value: 'avenir' },
  { title: 'Autre', value: 'autre' },
];

/**
 * Get the display label for an event type value
 * @param value - The event type value (e.g., "exposition")
 * @returns The display label (e.g., "Exposition"), or the value itself if not found
 */
export function getEventTypeLabel(value: string): string {
  const eventType = EVENT_TYPES.find(type => type.value === value);
  return eventType?.title ?? value;
}
