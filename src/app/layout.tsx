import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NairaFlow — Banking the informal economy",
  description:
    "NairaFlow banks Nigeria's 40M+ unbanked: mobile-first wallet, instant P2P payments, and low-cost diaspora remittances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
