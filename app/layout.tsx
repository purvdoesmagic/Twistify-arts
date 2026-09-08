import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twistify Arts | Handmade Crochet & Woolen Crafts",
  description:
    "Handmade crochet, woolen, floral, and festive crafts made with love by Shraddha Doshi at Twistify Arts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
