import Link from "next/link";

const tools = [
  {
    href: "/dashboard",
    icon: "⛓️",
    title: "Network Dashboard",
    desc: "Live block height, gas price, network status, and chain info for Base Mainnet.",
  },
  {
    href: "/wallet",
    icon: "👛",
    title: "Wallet Checker",
    desc: "Connect your wallet or enter any address to see ETH and USDC balances on Base.",
  },
  {
    href: "/explorer",
    icon: "🔍",
    title: "Transaction Explorer",
    desc: "Search any tx hash or wallet address and jump directly to Basescan.",
  },
  {
    href: "/gas",
    icon: "⛽",
    title: "Gas Calculator",
    desc: "Estimate real transaction costs on Base with live gas prices from the chain.",
  },
  {
    href: "/tools",
    icon: "🧰",
    title: "Ecosystem Tools",
    desc: "Curated directory of the best dApps, bridges, DEXes, and dev tools on Base.",
  },
  {
    href: "/faucets",
    icon: "🚰",
    title: "Faucet Directory",
    desc: "Testnet faucets and builder resources to ship and test on Base.",
  },
];

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">
          <span
            className="dot dot-pulse"
            style={{ background: "#22c55e" }}
          />
          Base Mainnet · Chain ID 8453
        </div>
        <h1 className="hero-title">
          Real tools for the
          <br />
          <span>Base ecosystem</span>
        </h1>
        <p className="hero-desc">
          Live network stats, wallet balances, gas estimates, tx explorer, and
          a curated tooling directory. No demo data. All live.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary">
            View Network →
          </Link>
          <Link href="/gas" className="btn btn-secondary">
            Estimate Gas
          </Link>
        </div>
      </div>

      <div className="tools-grid">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="tool-card">
            <div className="tool-card-icon">{t.icon}</div>
            <div className="tool-card-title">{t.title}</div>
            <div className="tool-card-desc">{t.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
