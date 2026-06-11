import Link from "next/link";

const categories = [
  {
    title: "DEXes & Trading",
    items: [
      {
        icon: "🦄",
        title: "Uniswap",
        desc: "The leading decentralised exchange — swap tokens on Base.",
        href: "https://app.uniswap.org/#/swap?chain=base",
        tag: "DEX",
      },
      {
        icon: "🟣",
        title: "Aerodrome Finance",
        desc: "Base-native AMM and liquidity hub, the largest DEX on Base.",
        href: "https://aerodrome.finance",
        tag: "DEX",
      },
      {
        icon: "🔵",
        title: "BaseSwap",
        desc: "Native DEX and yield farm on Base with deep liquidity pools.",
        href: "https://baseswap.fi",
        tag: "DEX",
      },
      {
        icon: "🌊",
        title: "SushiSwap",
        desc: "Multi-chain DEX supporting Base with cross-chain routing.",
        href: "https://www.sushi.com/swap?chainId=8453",
        tag: "DEX",
      },
    ],
  },
  {
    title: "Bridges",
    items: [
      {
        icon: "🌉",
        title: "Base Bridge (Official)",
        desc: "The canonical bridge by Coinbase — bridge ETH and tokens from Ethereum to Base.",
        href: "https://bridge.base.org",
        tag: "Bridge",
      },
      {
        icon: "⚡",
        title: "Across Protocol",
        desc: "Fast and capital-efficient cross-chain bridging to Base.",
        href: "https://app.across.to/?referrer=base-utility-hub",
        tag: "Bridge",
      },
      {
        icon: "🔁",
        title: "Stargate Finance",
        desc: "LayerZero-powered bridge supporting Base with native asset transfers.",
        href: "https://stargate.finance/transfer",
        tag: "Bridge",
      },
      {
        icon: "🌐",
        title: "Superbridge",
        desc: "Clean interface for bridging to Base and other OP Stack chains.",
        href: "https://superbridge.app/base",
        tag: "Bridge",
      },
    ],
  },
  {
    title: "Lending & DeFi",
    items: [
      {
        icon: "🏦",
        title: "Moonwell",
        desc: "Open lending protocol on Base — supply assets, borrow, and earn.",
        href: "https://moonwell.fi/base",
        tag: "Lending",
      },
      {
        icon: "💧",
        title: "Aave v3",
        desc: "The leading DeFi lending protocol, deployed on Base.",
        href: "https://app.aave.com/?marketName=proto_base_v3",
        tag: "Lending",
      },
      {
        icon: "📈",
        title: "Morpho Blue",
        desc: "Peer-to-peer lending optimisation layer on Base.",
        href: "https://app.morpho.org/?network=base",
        tag: "Lending",
      },
    ],
  },
  {
    title: "NFTs & Collectibles",
    items: [
      {
        icon: "🖼️",
        title: "OpenSea (Base)",
        desc: "The largest NFT marketplace — browse and trade Base NFTs.",
        href: "https://opensea.io/collection/base",
        tag: "NFT",
      },
      {
        icon: "🟦",
        title: "Zora",
        desc: "Creator-focused NFT minting and collecting protocol on Base.",
        href: "https://zora.co",
        tag: "NFT",
      },
      {
        icon: "🎨",
        title: "Mint.fun",
        desc: "Discover and mint the latest NFTs on Base.",
        href: "https://mint.fun",
        tag: "NFT",
      },
    ],
  },
  {
    title: "Developer Tools",
    items: [
      {
        icon: "📖",
        title: "Base Documentation",
        desc: "Official Base docs — quickstarts, guides, and API references.",
        href: "https://docs.base.org",
        tag: "Docs",
      },
      {
        icon: "🔨",
        title: "Hardhat",
        desc: "Ethereum dev environment with full Base support.",
        href: "https://hardhat.org",
        tag: "Dev",
      },
      {
        icon: "⚙️",
        title: "Foundry",
        desc: "Blazing-fast smart contract toolkit. Works seamlessly on Base.",
        href: "https://book.getfoundry.sh",
        tag: "Dev",
      },
      {
        icon: "🧑‍💻",
        title: "OnchainKit",
        desc: "Coinbase's React component library for building on Base.",
        href: "https://onchainkit.xyz",
        tag: "Dev",
      },
      {
        icon: "🔗",
        title: "viem",
        desc: "Type-safe TypeScript interface for Ethereum — works great with Base.",
        href: "https://viem.sh",
        tag: "Dev",
      },
      {
        icon: "🪝",
        title: "wagmi",
        desc: "React hooks for Ethereum — first-class Base support.",
        href: "https://wagmi.sh",
        tag: "Dev",
      },
    ],
  },
  {
    title: "Analytics & Data",
    items: [
      {
        icon: "📊",
        title: "Dune Analytics",
        desc: "Query and visualise on-chain data from Base with SQL.",
        href: "https://dune.com/browse/dashboards?q=base",
        tag: "Analytics",
      },
      {
        icon: "🦎",
        title: "CoinGecko — Base",
        desc: "Track tokens, prices, and DeFi data on Base.",
        href: "https://www.coingecko.com/en/chains/base",
        tag: "Analytics",
      },
      {
        icon: "📡",
        title: "DefiLlama — Base",
        desc: "Total value locked and protocol rankings on Base.",
        href: "https://defillama.com/chain/Base",
        tag: "Analytics",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🧰 Base Ecosystem Tools</h1>
        <p className="page-subtitle">
          Curated directory of the best dApps, protocols, bridges, and developer
          tools on Base Mainnet
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat.title} className="mb-lg">
          <div className="section-header">
            <span className="section-title">{cat.title}</span>
          </div>
          <div className="dir-grid">
            {cat.items.map((item) => (
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
        </div>
      ))}

      <div className="info-box info-box-blue mt-md">
        All links go to third-party services. Do your own research before
        connecting wallets or providing liquidity.{" "}
        <a href="https://base.org/ecosystem" target="_blank" rel="noopener noreferrer" className="text-link">
          See the full Base ecosystem directory →
        </a>
      </div>
    </div>
  );
}
