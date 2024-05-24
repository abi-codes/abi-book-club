//create a typed interface for address
export interface Address {
  id: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  countryCode: string;
  isPrimary: Boolean;
}