import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nacelle = localFont({
  src: [
    {
      path: "../public/fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

export const metadata = {
  title: "USP",
  description: "Unified Student Profile",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${nacelle.variable} bg-white-500 font-inter min-h-screen text-base text-wgi-200 antialiased`}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
          <Toaster />
          <div className="flex flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
