import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/app/components/info-page";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Twistify Arts and its handmade crochet and woolen creations.",
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About Twistify Arts"
      title="Small handmade details, made with care."
      intro="Twistify Arts creates crochet, woolen, floral, and festive pieces for gifting, celebrations, pooja, and cheerful corners at home."
    >
      <InfoSection title="What Twistify Arts is">
        <p>
          Twistify Arts is a handmade craft storefront where each listed piece is made with attention to its materials, shape, and finishing details.
        </p>
        <p>
          The collection includes flower garlands, floral accessories, lamps, festive decor, keychains, bouquets, and other small handmade details.
        </p>
      </InfoSection>
      <InfoSection title="A craft-focused approach">
        <p>
          Handmade work can have small variations from one piece to another. Those differences are part of the character of crafted products, while the product listing provides the details available for each creation.
        </p>
        <p>
          Some creations are available in stock and others are made to order. Availability is shown with each product.
        </p>
      </InfoSection>
      <InfoSection title="What customers can expect">
        <p>
          Customers can expect thoughtfully made products, clear listing information, and order updates through their account after a successful purchase.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/shop" className="rounded-full bg-[var(--rose)] px-5 py-3 font-semibold text-white transition hover:bg-[#95495b]">
            Browse the shop
          </Link>
          <Link href="/contact" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]">
            Contact Twistify Arts
          </Link>
        </div>
      </InfoSection>
    </InfoPage>
  );
}
