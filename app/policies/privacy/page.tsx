import type { Metadata } from "next";
import { InfoPage, InfoSection, PolicyLinks } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for Twistify Arts customers and website visitors.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Store policies"
      title="Privacy Policy"
      intro="This page explains at a high level what information Twistify Arts uses to operate the storefront, process orders, and support customers."
    >
      <InfoSection title="Information used by the storefront">
        <p>
          The application may use account information such as your name, email address, and authentication details when you create or use an account.
        </p>
        <p>
          An order may include delivery information such as your name, phone number, address, city, state, postal code, and country.
        </p>
      </InfoSection>
      <InfoSection title="Orders and payments">
        <p>
          Order and payment-related information is used to create, verify, fulfill, and support orders. Payments are processed through Razorpay, and relevant payment or order references are used to maintain the order record.
        </p>
      </InfoSection>
      <InfoSection title="Website usage">
        <p>
          The website may use information needed to keep pages, authentication, cart functionality, and order workflows working. The cart stores product IDs and quantities in the browser so your basket can persist between visits.
        </p>
      </InfoSection>
      <InfoSection title="Why information is used and shared">
        <p>
          Information is used to provide the storefront, authenticate customers, process payments, deliver orders, communicate about orders, and support customer requests.
        </p>
        <p>
          Information may be shared with service providers only when needed to operate the service, such as payment processing, authentication, hosting, or delivery-related support.
        </p>
      </InfoSection>
      <InfoSection title="Account security and questions">
        <p>
          Customers are responsible for keeping their account credentials private and should contact Twistify Arts if they notice an account or order concern.
        </p>
        <p>
          For privacy questions, use the contact details provided on the Contact page.
        </p>
        <PolicyLinks />
      </InfoSection>
    </InfoPage>
  );
}
