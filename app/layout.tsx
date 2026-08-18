import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wren & Loom | Handmade Crochet & Woolen Crafts",
  description:
    "Handmade crochet, woolen, floral, and festive crafts made with love by Shraddha Doshi.",
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
