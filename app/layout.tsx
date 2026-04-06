import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capsule App",
  description: "Built with the Capsule Base Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
