import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Raedah's Little World",
    description: "A dark cherry-blossom night with letters, lo-fi tracks, and little surprises — made for Raedah.",
    openGraph: {
      title: "Raedah's Little World",
      description: "I made you a whole night, Raedah.",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Raedah's moonlit cherry blossom garden" }],
    },
    twitter: { card: "summary_large_image", title: "Raedah's Little World", images: ["/og.png"] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
