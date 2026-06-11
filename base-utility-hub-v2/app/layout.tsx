import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "./components/SafeArea";
import { Providers } from "./providers";
import "./globals.css";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ?? "https://base-utility-hub.vercel.app";

// fc:frame metadata preserved from original + extended for v2
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Base Utility Hub",
    description:
      "All-in-one Base utility app — live network stats, wallet checker, gas calculator, explorer, and ecosystem tools.",
    openGraph: {
      title: "Base Utility Hub ⚡",
      description:
        "Check gas fees, wallet balances, live network stats and explore the Base ecosystem.",
      url: ROOT_URL,
      siteName: "Base Utility Hub",
      images: [{ url: `${ROOT_URL}/image.png`, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Base Utility Hub ⚡",
      description: "Real-time tools for the Base ecosystem",
      images: [`${ROOT_URL}/image.png`],
    },
    // fc:frame tag — preserved verbatim from original
    other: {
      "fc:frame": JSON.stringify({
        version: "1",
        imageUrl: `${ROOT_URL}/image.png`,
        button: {
          title: "Open Base Utility Hub",
          action: {
            type: "launch_frame",
            name: "Launch App",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Providers must wrap <html> — matches original structure exactly
    <Providers>
      <html lang="en">
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <SafeArea>
            <Nav />
            <main className="main-content">{children}</main>
            <footer className="footer">
              <div className="footer-inner">
                <span className="footer-brand">Base Utility Hub v2</span>
                <span className="footer-sep">·</span>
                <a
                  href="https://base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  base.org
                </a>
                <span className="footer-sep">·</span>
                <a
                  href="https://basescan.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  basescan.org
                </a>
                <span className="footer-sep">·</span>
                <a
                  href="https://docs.base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  docs.base.org
                </a>
              </div>
            </footer>
          </SafeArea>
        </body>
      </html>
    </Providers>
  );
}

// Nav imported here so it lives inside SafeArea (respects Farcaster safe-area insets)
import Nav from "./components/Nav";
