/* config/types/legals.d.ts */

export interface DeveloperConfig {
  name: string;
  url: string;
  email: string;
  siret?: string;
}

export interface HostConfig {
  name: string;
  address: string;
  url: string;
  privacyPolicyUrl: string;
}

export interface LegalDatesConfig {
  /** Human-readable date string, e.g. "4 mars 2026" */
  lastUpdated: string;
  /** ISO 8601 date string for <time datetime="…">, e.g. "2026-03-04" */
  lastUpdatedIso: string;
}

export interface LegalsConfig {
  developer: DeveloperConfig;
  host: HostConfig;
  dates: LegalDatesConfig;
}
