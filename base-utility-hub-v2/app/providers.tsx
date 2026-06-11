"use client";

import { ReactNode, useState } from "react";
import { base } from "wagmi/chains";
import { createConfig, http, WagmiProvider } from "wagmi";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { MiniAppProvider } from "./providers/MiniAppProvider";

// Single wagmi config that supports:
//  1. Farcaster MiniApp wallet (existing, preserved)
//  2. Browser injected wallets — MetaMask, Coinbase Wallet (new, additive)
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  connectors: [
    farcasterMiniApp(),           // ← Farcaster MiniApp connector (preserved)
    injected(),                    // ← MetaMask / browser wallets
    metaMask(),                    // ← MetaMask explicit
    coinbaseWallet({ appName: "Base Utility Hub" }), // ← Coinbase Wallet
  ],
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MiniAppProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </MiniAppProvider>
  );
}
