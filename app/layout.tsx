import type { Metadata } from "next";
import { headers } from "next/headers";
import { requestSiteUrl } from "./lib/site-url";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const base = new URL(requestSiteUrl(requestHeaders));

  return {
    metadataBase: base,
    title: "Symbolradar — Videos, essays and social posts",
    description:
      "A current index of videos, essays, and official social posts about symbolism, religion, and culture.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    alternates: {
      canonical: "/",
    },
    keywords: [
      "Matthieu Pageau",
      "Jonathan Pageau",
      "Jean-Philippe Marceau",
      "The Symbolic World",
      "symbolism",
      "essays",
      "videos",
    ],
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
      title: "Symbolradar",
      description:
        "Three current streams: videos, essays, and official social posts.",
      type: "website",
      url: "/",
      images: [
        {
          url: new URL("/og.png", base),
          width: 1672,
          height: 941,
          alt: "Symbolradar — videos, essays and social posts",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Symbolradar",
      description: "Videos, essays and official social posts in one place.",
      images: [new URL("/og.png", base)],
    },
  };
}

export const viewport = {
  themeColor: "#efe9dd",
};

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com https://cdn.syndication.twimg.com",
  "style-src 'self' 'unsafe-inline' https://platform.twitter.com",
  "img-src 'self' data: https://i.ytimg.com https://*.substackcdn.com https://substackcdn.com https://pbs.twimg.com https://www.thesymbolicworld.com",
  "frame-src https://platform.twitter.com https://syndication.twitter.com https://www.youtube.com",
  "connect-src 'self' https://syndication.twitter.com https://cdn.syndication.twimg.com",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="theme-color" content="#efe9dd" />
      </head>
      <body>{children}</body>
    </html>
  );
}
