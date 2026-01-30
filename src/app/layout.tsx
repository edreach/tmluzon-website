import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { InquiryProvider } from "@/contexts/cart-context";
import { ConditionalHeader, ConditionalFooter } from "@/components/conditional-layout";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TMLUZON - Modern Lighting",
  description: "Explore our collection of modern, minimalist lighting fixtures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn("font-body antialiased flex flex-col h-full", inter.variable)}>
        <FirebaseClientProvider>
          <InquiryProvider>
            <ConditionalHeader />
            <main className="flex-grow">{children}</main>
            <ConditionalFooter />
          </InquiryProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
