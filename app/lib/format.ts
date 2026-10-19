import { getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// Prices are whole rupees; divide order amounts (paise) by 100 before calling.
export function formatPrice(price: number) {
  return priceFormatter.format(price);
}

export function formatPhone(country: string, phone: string) {
  try {
    return `+${getCountryCallingCode(country as CountryCode)} ${phone}`;
  } catch {
    return phone;
  }
}

export function formatCountry(country: string) {
  try {
    return regionNames.of(country) ?? country;
  } catch {
    return country;
  }
}
