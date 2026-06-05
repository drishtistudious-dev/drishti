import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drishtistudios.in"),
  title: {
    default: "Drishti Studios | Premium Creative Studio",
    template: "%s | Drishti Studios",
  },
  description: "The Art of Observation. Premium luxury creative studio specializing in cinematography, photography, post production, and art direction.",
  keywords: ["luxury photography", "cinematography", "creative studio", "wedding photography", "post production", "art direction", "Drishti Studios"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://drishtistudios.in",
    siteName: "Drishti Studios",
    title: "Drishti Studios | Premium Creative Studio",
    description: "Premium luxury creative studio specializing in cinematography, photography, and art direction.",
    images: [
      {
        url: "/drishti_logo.png",
        width: 1200,
        height: 630,
        alt: "Drishti Studios Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drishti Studios | Premium Creative Studio",
    description: "Premium luxury creative studio specializing in cinematography, photography, and art direction.",
    images: ["/drishti_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} dark`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
