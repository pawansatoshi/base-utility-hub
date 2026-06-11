const faucets = [
  {
    icon: "🚰",
    title: "Coinbase Base Faucet",
    desc: "Official testnet faucet by Coinbase — get Base Sepolia ETH to test your dApps.",
    href: "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet",
    tag: "Official",
    network: "Base Sepolia",
  },
  {
    icon: "🔵",
    title: "Base Sepolia Faucet (Alchemy)",
    desc: "Alchemy's faucet for Base Sepolia testnet. Requires a free Alchemy account.",
    href: "https://basefaucet.com",
    tag: "Testnet",
    network: "Base Sepolia",
  },
  {
    icon: "⛽",
    title: "QuickNode Base Faucet",
    desc: "QuickNode multi-chain faucet supporting Base Sepolia testnet.",
    href: "https://faucet.quicknode.com/base/sepolia",
    tag: "Testnet",
    network: "Base Sepolia",
  },
  {
    icon: "🌊",
    title: "Superchain Faucet",
    desc: "Get testnet ETH for Base Sepolia and other OP Stack chains in one place.",
    href: "https://app.optimism.io/faucet",
    tag: "Testnet",
    network: "Base Sepolia",
  },
  {
    icon: "💧",
    title: "thirdweb Faucet",
    desc: "Simple faucet for Base Sepolia — no API key required.",
    href: "https://thirdweb.com/base-sepolia-testnet",
    tag: "Testnet",
    network: "Base Sepolia",
  },
  {
    icon: "🧪",
    title: "LearnWeb3 Faucet",
    desc: "Multichain testnet faucet with Base Sepolia support, no login needed.",
    href: "https://learnweb3.io/faucets/base-sepolia",
    tag: "Testnet",
    network: "Base Sepolia",
  },
];

const builderResources = [
  {
    icon: "📖",
    title: "Base Developer Docs",
    desc: "Official quickstarts, tutorials, and API references for building on Base.",
    href: "https://docs.base.org",
    tag: "Docs",
  },
  {
    icon: "🏗️",
    title: "Base Buildathon",
    desc: "Hackathon and grant programmes from the Base team for builders.",
    href: "https://base.org/buildathon",
    tag: "Grants",
  },
  {
    icon: "🧑‍💻",
    title: "OnchainKit",
    desc: "Coinbase's open-source React component library for building on Base fast.",
    href: "https://onchainkit.xyz",
    tag: "SDK",
  },
  {
    icon: "🪄",
    title: "Base Mini Apps",
    desc: "Build Farcaster Mini Apps that run natively inside the Base and Farcaster ecosystem.",
    href: "https://docs.base.org/builderkits/minikit/overview",
    tag: "Mini Apps",
  },
  {
    icon: "🔵",
    title: "Base Camp",
    desc: "Free smart contract development curriculum built for Base by Coinbase.",
    href: "https://base.org/learn",
    tag: "Learning",
  },
  {
    icon: "💬",
    title: "Base Discord",
    desc: "Join the Base developer community — get help, share projects, find co-builders.",
    href: "https://discord.gg/buildonbase",
    tag: "Community",
  },
  {
    icon: "🐦",
    title: "Base on X (Twitter)",
    desc: "Follow @base for ecosystem news, grant announcements, and builder spotlights.",
    href: "https://x.com/base",
    tag: "Community",
  },
  {
    icon: "🤝",
    title: "Coinbase Grants",
    desc: "Apply for ecosystem grants from Coinbase to fund your Base project.",
    href: "https://www.coinbase.com/grants",
    tag: "Grants",
  },
];

export default function FaucetsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🚰 Faucet Directory</h1>
        <p className="page-subtitle">
          Testnet faucets and builder resources to develop and ship on Base
        </p>
      </div>

      <div className="info-box info-box-yellow mb-lg">
        ⚠️ These faucets provide <strong>testnet ETH only</strong> — for Base
        Sepolia. Testnet tokens have no real value and cannot be used on Base
        Mainnet.
      </div>

      <div className="section-header">
        <span className="section-title">Testnet Faucets</span>
        <span className="badge badge-yellow">Base Sepolia</span>
      </div>

      <div className="dir-grid mb-lg">
        {faucets.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dir-card"
          >
            <div className="dir-card-icon">{item.icon}</div>
            <div className="dir-card-body">
              <div className="dir-card-title">{item.title}</div>
              <div className="dir-card-desc">{item.desc}</div>
              <div className="flex gap-sm flex-wrap" style={{ marginTop: 6 }}>
                <span className="dir-card-tag">{item.tag}</span>
                <span className="dir-card-tag">{item.network}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <hr className="divider" />

      <div className="section-header">
        <span className="section-title">Builder Resources</span>
        <span className="badge badge-blue">Ship on Base</span>
      </div>

      <div className="dir-grid">
        {builderResources.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dir-card"
          >
            <div className="dir-card-icon">{item.icon}</div>
            <div className="dir-card-body">
              <div className="dir-card-title">{item.title}</div>
              <div className="dir-card-desc">{item.desc}</div>
              <span className="dir-card-tag">{item.tag}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="info-box info-box-blue mt-lg">
        Base Sepolia RPC:{" "}
        <span className="mono" style={{ fontSize: 12 }}>
          https://sepolia.base.org
        </span>
        {" · "}Chain ID:{" "}
        <span className="mono">84532</span>
        {" · "}
        Explorer:{" "}
        <a
          href="https://sepolia.basescan.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          sepolia.basescan.org ↗
        </a>
      </div>
    </div>
  );
}
