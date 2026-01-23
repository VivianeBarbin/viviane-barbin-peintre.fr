// config/contact.ts
import type { ContactDataProps } from "./types";

export const contactData: ContactDataProps = {
  phone: "+33 X XX XX XX XX",
  phone_link: "tel:+33XXXXXXXXX",
  email: "viviane@vivianebarbin.fr",
  address: {
    street: "",
    city: "",
    postalCode: "",
    region: "",
    country: "France",
  },

  businessHours: {
    weekdays: "9:00 - 18:00",
    saturday: "10:00 - 16:00",
    sunday: "Fermé",
  },

  website: "https://vivianebarbin.com",
};
