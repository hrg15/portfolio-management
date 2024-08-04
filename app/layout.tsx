import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider";

const font = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--poppins",
});

export const metadata: Metadata = {
  title: "Portfolio Management",
  description: "Manage portfolio easily and safely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          <main className="h-screen overflow-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
