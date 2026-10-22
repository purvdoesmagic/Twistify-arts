import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      ["/shop", "All pieces"],
      ["/shop?category=LED%20flower%20night%20lamps#catalog", "Night lamps"],
      ["/shop?category=Flower%20garlands%20%26%20malas#catalog", "Garlands & malas"],
      ["/shop?category=Keychains#catalog", "Keychains"],
    ],
  },
  {
    title: "Help",
    links: [
      ["/faq", "FAQ"],
      ["/contact", "Contact"],
      ["/account", "Track your order"],
      ["/policies/shipping", "Shipping"],
      ["/policies/refunds", "Refunds"],
    ],
  },
  {
    title: "Studio",
    links: [
      ["/about", "About Shraddha"],
      ["/policies/privacy", "Privacy"],
      ["/policies/terms", "Terms"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer px-5 pb-8 pt-[20svh] text-(length:--step-small) sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-serif text-(length:--step-lead) uppercase leading-none">Twistify Arts</p>
          <p className="mt-4 max-w-[30ch] text-(--muted)">Handmade crochet by Shraddha Doshi. Custom colours and sizes on request.</p>
          <a href="mailto:twistifyarts@gmail.com" className="text-link mt-4 inline-flex min-h-11 items-center">
            twistifyarts@gmail.com
          </a>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="font-semibold">{column.title}</p>
            <ul className="mt-2">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="sweep-link inline-flex min-h-11 items-center">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-(--muted)">
        <span>© {new Date().getFullYear()} Twistify Arts</span>
        <span>Secure payments by Razorpay · Prices in rupees</span>
      </p>
    </footer>
  );
}
