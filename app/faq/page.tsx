import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/app/components/info-page";
import { MAX_PER_PIECE } from "@/app/lib/cart-limits";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, made-to-order pieces, payment, shipping and custom requests at Twistify Arts.",
};

const faqs: Array<[string, React.ReactNode]> = [
  ["What does “Made to order” mean?", "The piece is crocheted after you order, so it takes longer than one marked “In stock”, which is already made and is packed once you pay."],
  ["Are the pieces exactly like the pictures?", "Every piece is crocheted by hand, so colours, petal shapes and sizes vary a little. Photographs of the finished pieces are coming; until then the shop shows drawings."],
  ["Can I ask for a different colour, size or phone model?", <>Yes. <Link href="/contact" className="text-link">Write to the studio</Link> before you order and describe what you need.</>],
  ["How do I pay?", "Checkout uses Razorpay, in rupees. You need an account to place an order."],
  ["How much is delivery, and how long does it take?", <>Charges and timing are confirmed at checkout and depend on your address. See the <Link href="/policies/shipping" className="text-link">shipping policy</Link>.</>],
  ["Is there a limit on how many I can order?", `Up to ${MAX_PER_PIECE} of each piece per order. For larger quantities, such as festival or wedding gifting, write to the studio first.`],
  ["Where can I follow my order?", <>Sign in and open <Link href="/account" className="text-link">your account</Link> to see payment and fulfilment status.</>],
  ["What if something arrives damaged or wrong?", <>Contact us as soon as you can with your order details and photos. See the <Link href="/policies/refunds" className="text-link">refund policy</Link>.</>],
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((item): item is [string, string] => typeof item[1] === "string")
      .map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
  };

  return (
    <InfoPage title="Questions, answered" plate={1} intro="The things people ask most before ordering a handmade piece.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <InfoSection title="Ordering and delivery">
        <div className="max-w-[60ch] divide-y divide-(--border) border-y border-(--border)">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group py-1">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-(--ink)">
                {question}
                <span aria-hidden="true" className="text-(--muted) transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-3 text-(--muted)">{answer}</p>
            </details>
          ))}
        </div>
      </InfoSection>
    </InfoPage>
  );
}
