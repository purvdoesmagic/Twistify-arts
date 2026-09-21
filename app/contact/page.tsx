import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Twistify Arts about handmade products and orders.",
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact Twistify Arts"
      title="We would be glad to hear from you."
      intro="For product questions, order questions, or help understanding an item listing, please use the contact details below."
    >
      <InfoSection title="Contact details">
        <p>
          Business email: <span className="font-semibold text-[var(--ink)]">[Business Email]</span>
        </p>
        <p>
          Phone: <span className="font-semibold text-[var(--ink)]">[Phone Number 1]</span>
        </p>
        <p>
          Alternate phone: <span className="font-semibold text-[var(--ink)]">[Phone Number 2]</span>
        </p>
        <p className="text-xs text-[var(--muted)]">
          Contact details are temporary placeholders and will be replaced with the confirmed business information.
        </p>
      </InfoSection>
      <InfoSection title="Product and order questions">
        <p>
          When asking about a product, include its name or product page so the relevant creation can be identified clearly.
        </p>
        <p>
          For an existing order, include the order reference from your confirmation or account page. Please do not send passwords or payment credentials.
        </p>
      </InfoSection>
      <InfoSection title="Finding your order information">
        <p>
          Signed-in customers can review saved orders and their current fulfillment status from the account page.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/account" className="rounded-full bg-[var(--ink)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--rose)]">
            View my account
          </Link>
          <Link href="/shop" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]">
            Continue shopping
          </Link>
        </div>
      </InfoSection>
    </InfoPage>
  );
}
