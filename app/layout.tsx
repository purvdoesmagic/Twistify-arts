import type { Metadata } from "next";
import { Albert_Sans, Imbue } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/auth-provider";
import { CartProvider } from "./components/cart-provider";
import { StorefrontChrome } from "./components/storefront-chrome";

const display = Imbue({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display" });
const text = Albert_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-text" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Twistify Arts | Handmade Crochet & Woolen Crafts",
    template: "%s | Twistify Arts",
  },
  description:
    "Shop handmade crochet, woolen, floral, and festive crafts from Twistify Arts.",
  openGraph: {
    type: "website",
    siteName: "Twistify Arts",
    title: "Twistify Arts | Handmade Crochet & Woolen Crafts",
    description:
      "Shop handmade crochet, woolen, floral, and festive crafts from Twistify Arts.",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Twistify Arts handmade crochet and woolen crafts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twistify Arts | Handmade Crochet & Woolen Crafts",
    description:
      "Shop handmade crochet, woolen, floral, and festive crafts from Twistify Arts.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets the motion styles hide content only when scripting can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <StorefrontChrome>{children}</StorefrontChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
