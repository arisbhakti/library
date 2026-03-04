import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_NAME = "Booky";
const SITE_TITLE = "Booky | Digital Library Platform";
const SITE_DESCRIPTION =
  "Booky adalah platform perpustakaan digital untuk menemukan buku, meminjam, dan mengelola koleksi dengan cepat.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";
const SITE_ICON = "/booky-app-icon.svg";
const ICON_VERSION = "20260304";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "booky",
    "digital library",
    "perpustakaan online",
    "pinjam buku",
    "manajemen buku",
    "book recommendation",
  ],
  authors: [{ name: "Booky Team" }],
  creator: "Booky Team",
  publisher: SITE_NAME,
  category: "books",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_ICON,
        width: 512,
        height: 512,
        alt: "Booky app icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_ICON],
  },
  icons: {
    icon: [
      { url: `${SITE_ICON}?v=${ICON_VERSION}`, type: "image/svg+xml" },
      { url: `/favicon.ico?v=${ICON_VERSION}`, sizes: "any" },
    ],
    shortcut: [`${SITE_ICON}?v=${ICON_VERSION}`],
    apple: [{ url: `${SITE_ICON}?v=${ICON_VERSION}`, type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C65DA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${quicksand.className} ${quicksand.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
