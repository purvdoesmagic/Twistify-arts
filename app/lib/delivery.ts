// Shared by the checkout form (client) and the payment routes (server).

const indianPinCode = /^\d{6}$/;
const internationalPostalCode = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/;

export function isValidPostalCode(country: string, postalCode: string) {
  if (country === "IN") {
    return indianPinCode.test(postalCode);
  }

  // Some countries have no postal codes, so it is optional outside India.
  return postalCode === "" || internationalPostalCode.test(postalCode);
}

export function postalCodeLabel(country: string) {
  return country === "IN" ? "PIN code" : "Postal code";
}
