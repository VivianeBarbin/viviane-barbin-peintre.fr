// config/contact.ts
import { devLog, fetchSanity } from "../src/lib/sanityFetch";
import { CONTACT_SETTINGS_QUERY } from "../src/lib/sanityQueries";
import type { ContactDataProps } from "./types";

/**
 * Fallback (hardcoded) values.
 * Keep this as the default source of truth when:
 * - dataset is empty
 * - Sanity fetch fails
 * - fields are missing/empty in CMS
 */
export const contactData: ContactDataProps = {
  phone: "+33 6 43 82 62 69",
  phone_link: "tel:+33643826269",
  email: "viviane@viviane-barbin-peintre.fr",
  address: {
    street: "4 Rue de la Foire",
    city: "TALON",
    postalCode: "58190",
    region: "58",
    country: "FRANCE",
  },

  businessHours: {
    weekdays: "9:00 - 18:00",
    saturday: "10:00 - 16:00",
    sunday: "Fermé",
  },

  website: "https://viviane-barbin-peintre.fr",
};

type ContactSettingsCMS = Partial<{
  phone: string;
  phone_link: string;
  email: string;
  website: string;
  address: Partial<{
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
  }>;
  businessHours: Partial<{
    weekdays: string;
    saturday: string;
    sunday: string;
  }>;
}>;

let cachedContactData: ContactDataProps | null = null;

function preferNonEmptyString(fallback: string, value: unknown): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function mergeContactData(fallback: ContactDataProps, cms: ContactSettingsCMS): ContactDataProps {
  return {
    phone: preferNonEmptyString(fallback.phone, cms.phone),
    phone_link: preferNonEmptyString(fallback.phone_link, cms.phone_link),
    email: preferNonEmptyString(fallback.email, cms.email),
    website: preferNonEmptyString(fallback.website, cms.website),

    address: {
      street: preferNonEmptyString(fallback.address.street, cms.address?.street),
      city: preferNonEmptyString(fallback.address.city, cms.address?.city),
      postalCode: preferNonEmptyString(fallback.address.postalCode, cms.address?.postalCode),
      region: preferNonEmptyString(fallback.address.region, cms.address?.region),
      country: preferNonEmptyString(fallback.address.country, cms.address?.country),
    },

    businessHours: {
      weekdays: preferNonEmptyString(fallback.businessHours.weekdays, cms.businessHours?.weekdays),
      saturday: preferNonEmptyString(fallback.businessHours.saturday, cms.businessHours?.saturday),
      sunday: preferNonEmptyString(fallback.businessHours.sunday, cms.businessHours?.sunday),
    },
  };
}

/**
 * Async getter (SSR/build):
 * - fetches singleton `contactSettings`
 * - deep merges with `contactData` fallback (field-by-field)
 * - memoized per process to avoid multiple fetches during a single render/build
 */
export async function getContactData(): Promise<ContactDataProps> {
  if (cachedContactData) return cachedContactData;

  try {
    const cms = await fetchSanity<ContactSettingsCMS>(CONTACT_SETTINGS_QUERY);

    if (!cms) {
      devLog("[contact] Using fallback (no contactSettings document found).");
      cachedContactData = contactData;
      return cachedContactData;
    }

    cachedContactData = mergeContactData(contactData, cms);
    return cachedContactData;
  } catch (err) {
    devLog("[contact] Using fallback (Sanity fetch failed).", err);
    cachedContactData = contactData;
    return cachedContactData;
  }
}
