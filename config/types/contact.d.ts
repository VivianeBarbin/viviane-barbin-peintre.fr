/* config/types/contact.d.ts */
export interface ContactDataProps {
  phone: string;
  phone_link: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    regionNum: string;
    regionLong: string;
    country: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  website: string;
  websiteBnB: string;
}
