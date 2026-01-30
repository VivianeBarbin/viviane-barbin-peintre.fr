// config/contact.ts
import type { ContactDataProps } from "./types";

export const contactData: ContactDataProps = {
  phone: "+33 6 43 82 62 69",
  phone_link: "tel:+33643826269",
  email: "viviane@vivianebarbin.fr",
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
