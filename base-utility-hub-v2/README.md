# Base Utility Hub v2

Real-time tools for the Base ecosystem. Live network stats, wallet balances, gas calculator, transaction explorer, ecosystem directory, and faucet directory.

Built on Next.js 15 · viem · wagmi · Farcaster MiniApp SDK

---

## Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hub overview and navigation |
| Network Dashboard | `/dashboard` | Live block, gas, and chain info — auto-refreshes every 12s |
| Wallet Checker | `/wallet` | Connect wallet or enter any address — shows ETH + USDC balances |
| Transaction Explorer | `/explorer` | Search tx hash or address, jump to Basescan |
| Gas Calculator | `/gas` | Live gas prices + cost estimator for common tx types |
| Ecosystem Tools | `/tools` | Curated directory of DEXes, bridges, lending, NFTs, dev tools |
| Faucet Directory | `/faucets` | Testnet faucets and builder resources |

**Farcaster compatibility fully preserved:**
- `/success` — Farcaster waitlist share page
- `/api/auth` — Farcaster Quick Auth JWT verification
- `public/.well-known/farcaster.json` — signed manifest (untouched)
- `farcaster.config.ts` — MiniApp configuration (untouched)
- `MiniAppProvider` + `SafeArea` — safe-area insets for Mini App viewport

---

## Base Mainnet Configuration

| Field | Value |
|-------|-------|
| Network | Base Mainnet |
| Chain ID | 8453 |
| Currency | ETH |
| RPC | https://mainnet.base.org |
| Explorer | https://basescan.org |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

Create `.env.local`:
```
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_PROJECT_NAME="Base Utility Hub"
```

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Next.js** (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_URL` = `https://your-project.vercel.app`
5. Deploy

### Environment variables on Vercel
```
NEXT_PUBLIC_URL=https://base-utility-hub.vercel.app
```

No other environment variables are required. All blockchain data is fetched
server-side from `https://mainnet.base.org` — no API keys needed.

---

## Project Structure

```
base-utility-hub-v2/
├── app/
│   ├── layout.tsx                  # Root layout — Farcaster Providers + SafeArea + Nav
│   ├── page.tsx                    # Home / hub overview
│   ├── globals.css                 # Full design system (dark, mobile-first)
│   ├── providers.tsx               # Wagmi + React Query + Farcaster MiniApp provider
│   ├── rootProvider.tsx            # Original Farcaster-only provider (preserved)
│   ├── providers/
│   │   └── MiniAppProvider.tsx     # Farcaster SDK init + context (preserved verbatim)
│   ├── components/
│   │   ├── Nav.tsx                 # Sticky navigation
│   │   └── SafeArea.tsx            # Farcaster safe-area insets (preserved verbatim)
│   ├── api/
│   │   ├── auth/route.ts           # Farcaster Quick Auth (preserved verbatim)
│   │   ├── network/route.ts        # Live Base network stats via viem
│   │   ├── gas/route.ts            # Live gas prices via viem
│   │   └── wallet/route.ts         # ETH + USDC balance lookup via viem
│   ├── dashboard/page.tsx          # Network Dashboard
│   ├── wallet/page.tsx             # Wallet Checker
│   ├── explorer/page.tsx           # Transaction Explorer
│   ├── gas/page.tsx                # Gas Calculator
│   ├── tools/page.tsx              # Ecosystem Tools Directory
│   ├── faucets/page.tsx            # Faucet Directory
│   └── success/                    # Farcaster waitlist success page (preserved verbatim)
├── public/
│   ├── .well-known/farcaster.json  # Signed Farcaster manifest (DO NOT EDIT)
│   └── *.png / *.svg               # All original assets preserved
├── farcaster.config.ts             # Farcaster MiniApp config (preserved verbatim)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5**
- **viem 2** — blockchain reads (server-side, no wallet needed)
- **wagmi 2** — wallet connect hooks (client-side)
- **@tanstack/react-query 5** — data fetching
- **@farcaster/miniapp-sdk** — Farcaster Mini App integration
- **@farcaster/miniapp-wagmi-connector** — Farcaster wallet connector
- **@farcaster/quick-auth** — JWT auth for Mini Apps
