import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { FundModal } from "@/components/strategy/FundModal";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curator Studio",
  description: "On-chain capital allocation strategy platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <FundModal />
        </Providers>
      </body>
    </html>
  );
}
