import type { Metadata } from "next";
import { InfoPage, InfoSection, PolicyLinks } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "Refund and return information for Twistify Arts handmade products.",
};

export default function RefundsPolicyPage() {
  return (
    <InfoPage
      eyebrow="Store policies"
      title="Refund & Return Policy"
      intro="Because Twistify Arts products are handmade, each refund or return request is reviewed according to the order and the product condition."
    >
      <InfoSection title="General approach">
        <p>
          Refunds and returns are not automatic. Contact Twistify Arts with your order details so the request can be reviewed under the applicable policy.
        </p>
      </InfoSection>
      <InfoSection title="Damaged or incorrect products">
        <p>
          If a product arrives damaged or is not the product ordered, contact Twistify Arts promptly with the order reference and clear details of the issue. Photos may help with the review.
        </p>
      </InfoSection>
      <InfoSection title="Product condition">
        <p>
          Where a return is approved, the product may need to be unused, in its original condition, and accompanied by the relevant order information. Handmade products should be handled carefully while a request is being reviewed.
        </p>
      </InfoSection>
      <InfoSection title="Refund processing">
        <p>
          If a refund is approved, the refund process and timing will be confirmed with the customer. Processing may depend on the payment method and the information needed to complete the request.
        </p>
      </InfoSection>
      <InfoSection title="Requests that may not qualify">
        <p>
          Requests may not qualify when a product has been used, damaged after delivery, altered, or when the issue results from inaccurate delivery information supplied at checkout. Each request remains subject to review.
        </p>
        <PolicyLinks />
      </InfoSection>
    </InfoPage>
  );
}
