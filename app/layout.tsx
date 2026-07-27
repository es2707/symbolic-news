import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "Symbolradar — Pageau, Marceau & The Symbolic World",
    description:
      "En levende strøm med nye videoer, tekster, samtaler og omtaler rundt Matthieu Pageau, Jonathan Pageau og Jean-Philippe Marceau.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Symbolradar",
      description:
        "Følg mønsteret mens det utfolder seg — videoer, essays, samtaler og omtaler samlet på ett sted.",
      type: "website",
      images: [
        {
          url: new URL("/og.png", base),
          width: 1672,
          height: 941,
          alt: "Symbolradar — Følg mønsteret mens det utfolder seg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Symbolradar",
      description: "Et levende arkiv over symbolsk tenkning.",
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
    <html lang="nb">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="theme-color" content="#efe9dd" />
      </head>
      <body>{children}</body>
    </html>
  );
}
