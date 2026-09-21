import type { Metadata } from "next";
import { InfoPage, InfoSection, PolicyLinks } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the Twistify Arts storefront and placing orders.",
};

export default function TermsPolicyPage() {
  return (
    <InfoPage
      eyebrow="Store policies"
      title="Terms & Conditions"
      intro="These terms describe the basic expectations for using the Twistify Arts website and placing an order."
    >
      <InfoSection title="Using the website">
        <p>
          By using the website, you agree to use it lawfully and respectfully, and to provide accurate information when creating an account or placing an order.
        </p>
      </InfoSection>
      <InfoSection title="Products, availability, and pricing">
        <p>
          Product descriptions, images, availability, and prices are provided for the listed creations and may change. Handmade products may have small variations in colour or detail.
        </p>
        <p>
          An order is subject to product availability and the information confirmed during checkout.
        </p>
      </InfoSection>
      <InfoSection title="Accounts and payments">
        <p>
          You are responsible for keeping your account credentials private and for the activity associated with your account.
        </p>
        <p>
          Payments are processed through Razorpay. Payment verification is required before an order can be recorded as paid.
        </p>
      </InfoSection>
      <InfoSection title="Order acceptance and cancellation">
        <p>
          Twistify Arts may review an order before fulfillment, including when an item is unavailable or order information needs clarification. Any cancellation or refund request is handled under the applicable store policy.
        </p>
      </InfoSection>
      <InfoSection title="Site content and responsibility">
        <p>
          Twistify Arts retains rights in its original site content, product descriptions, images, and branding. Please do not copy or reuse that content without permission.
        </p>
        <p>
          The website is provided to support browsing, account access, ordering, and customer communication. Reasonable efforts are made to keep information useful and services available, but interruptions or inaccuracies may occasionally occur.
        </p>
      </InfoSection>
      <InfoSection title="Changes and contact">
        <p>
          The website and these policies may be updated as the storefront develops. Continued use of the website after an update means the revised information may apply to future use or orders.
        </p>
        <p>For questions about these terms, use the contact details on the Contact page.</p>
        <PolicyLinks />
      </InfoSection>
    </InfoPage>
  );
}
