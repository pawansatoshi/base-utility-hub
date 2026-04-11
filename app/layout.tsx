import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "./components/SafeArea";
import { farcasterConfig } from "../farcaster.config";
import { Providers } from "./providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Base Utility Hub",
    description: "All-in-one Base utility app",

    other: {
      "fc:frame": JSON.stringify({
        version: "1",
        imageUrl: "https://base-utility-hub.vercel.app/image.png",
        button: {
          title: "Open Base Utility",
          action: {
            type: "launch_frame",
            name: "Launch App"
          }
        }
      })
    }
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
        <meta name="base:app_id" content="69da2ff92c63bda0567315e3" />
        </head>
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <SafeArea>{children}</SafeArea>
        </body>
      </html>
    </Providers>
  );
}
