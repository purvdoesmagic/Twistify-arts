import type { Metadata } from "next";
import { InfoPage, InfoSection, PolicyLinks } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery information for Twistify Arts orders.",
};

export default function ShippingPolicyPage() {
  return (
    <InfoPage
      eyebrow="Store policies"
      title="Shipping Policy"
      intro="We prepare handmade orders carefully and confirm the applicable shipping details as part of checkout."
    >
      <InfoSection title="Order processing">
        <p>
          Processing time can vary depending on whether an item is in stock or made to order. The expected preparation details will be considered when your order is placed.
        </p>
      </InfoSection>
      <InfoSection title="Shipping and estimated delivery">
        <p>
          Shipping timelines and charges will be confirmed at checkout. Delivery times may vary depending on destination and courier conditions.
        </p>
        <p>
          An estimated delivery timeline, where available, should be treated as an estimate rather than a guaranteed date.
        </p>
      </InfoSection>
      <InfoSection title="Possible delays">
        <p>
          Handmade preparation, weather, public holidays, courier conditions, or address-related issues may affect delivery timing.
        </p>
      </InfoSection>
      <InfoSection title="Address accuracy">
        <p>
          Please review the delivery name, phone number, address, city, state, country, and postal code before completing payment. An incorrect or incomplete address can delay delivery.
        </p>
      </InfoSection>
      <InfoSection title="Damaged or lost shipments">
        <p>
          Contact Twistify Arts as soon as possible if an order arrives damaged or does not arrive as expected. Include your order details and any useful photos or delivery information so the situation can be reviewed.
        </p>
      </InfoSection>
      <InfoSection title="Questions">
        <p>For shipping questions, please use the contact details on the Contact page.</p>
        <PolicyLinks />
      </InfoSection>
    </InfoPage>
  );
}
