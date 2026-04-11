"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Coin = {
  id: string;
  name: string;
  current_price: number;
};

type NewsItem = {
  title: string;
  url: string;
  source: string;
};

export default function Home() {
  const [tab, setTab] = useState<"gas" | "prices" | "news">("gas");

  const [gasPrice, setGasPrice] = useState<string>("");
  const [gasLimit, setGasLimit] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<number>(0);

  const [coins, setCoins] = useState<Coin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  // ETH price (USD)
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then(res => res.json())
      .then(data => {
        if (data?.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        }
      });
  }, []);

  // Top 50 coins
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50")
      .then(res => res.json())
      .then((data: Coin[]) => setCoins(data))
      .catch(() => setCoins([]));
  }, []);

  // ✅ FIXED NEWS (NO "any", VERCEL SAFE)
  useEffect(() => {
    fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN")
      .then(res => res.json())
      .then(data => {
        if (data?.Data) {
          const formatted: NewsItem[] = data.Data.map((n: {
            title: string;
            url: string;
            source_info?: { name: string };
          }) => ({
            title: n.title,
            url: n.url,
            source: n.source_info?.name || "Unknown"
          }));

          setNews(formatted);
        }
      })
      .catch(() => setNews([]));
  }, []);

  const calculateFee = (price?: number) => {
    const p = price ?? parseFloat(gasPrice);
    const l = parseFloat(gasLimit);

    if (!p || !l) {
      setResult("Enter valid values");
      return;
    }

    const feeETH = (p * l) / 1e9;
    const feeUSD = feeETH * ethPrice;

    setResult(`Fee: ${feeETH.toFixed(6)} ETH (~$${feeUSD.toFixed(2)})`);
  };

  return (
    <div style={container}>
      
      {/* HEADER */}
      <div style={header}>
        <Image
          src="/base-logo.png"
          alt="Base logo"
          width={32}
          height={32}
        />
        <h1 style={title}>Base Utility Hub ⚡</h1>
      </div>

      {/* TABS */}
      <div style={tabs}>
        <button onClick={() => setTab("gas")} style={tab === "gas" ? activeTab : tabBtn}>Gas</button>
        <button onClick={() => setTab("prices")} style={tab === "prices" ? activeTab : tabBtn}>Prices</button>
        <button onClick={() => setTab("news")} style={tab === "news" ? activeTab : tabBtn}>News</button>
      </div>

      {/* CARD */}
      <div style={card}>

        {/* GAS */}
        {tab === "gas" && (
          <>
            <h2 style={sectionTitle}>Gas Fee Estimator</h2>

            <input
              placeholder="Gas Price (gwei)"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              style={input}
            />

            <input
              placeholder="Gas Limit"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              style={input}
            />

            <button onClick={() => calculateFee()} style={mainBtn}>
              Calculate
            </button>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => calculateFee(10)} style={smallBtn}>Low</button>
              <button onClick={() => calculateFee(20)} style={smallBtn}>Medium</button>
              <button onClick={() => calculateFee(30)} style={smallBtn}>High</button>
            </div>

            <p style={{ marginTop: 10 }}>{result}</p>
            <p style={{ opacity: 0.7 }}>ETH Price: ${ethPrice}</p>
          </>
        )}

        {/* PRICES */}
        {tab === "prices" && (
          <>
            <h2 style={sectionTitle}>Top 50 Crypto Prices</h2>

            {coins.length === 0 && <p>Loading prices...</p>}

            {coins.map((c) => (
              <div key={c.id} style={listItem}>
                {c.name} — ${c.current_price}
              </div>
            ))}
          </>
        )}

        {/* NEWS */}
        {tab === "news" && (
          <>
            <h2 style={sectionTitle}>Crypto News</h2>

            {news.length === 0 && <p>Loading news...</p>}

            {news.map((n, i) => (
              <div key={i} style={listItem}>
                <a href={n.url} target="_blank" style={{ color: "#38bdf8" }}>
                  {n.title}
                </a>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {n.source}
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  padding: 20,
  background: "#0f172a",
  color: "white",
  minHeight: "100vh",
  fontFamily: "Arial"
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 20
};

const title = {
  fontSize: "18px",
  fontWeight: "600"
};

const tabs = {
  marginBottom: 20
};

const tabBtn = {
  marginRight: 10,
  padding: "8px 12px",
  borderRadius: 8,
  background: "#1e293b",
  color: "white",
  border: "1px solid #334155",
  cursor: "pointer"
};

const activeTab = {
  ...tabBtn,
  background: "#2563eb"
};

const card = {
  background: "#1e293b",
  padding: 15,
  borderRadius: 12
};

const sectionTitle = {
  marginBottom: 10
};

const input = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  borderRadius: 6
};

const mainBtn = {
  padding: 10,
  borderRadius: 6,
  cursor: "pointer"
};

const smallBtn = {
  marginRight: 5,
  padding: 6,
  borderRadius: 6,
  cursor: "pointer"
};

const listItem = {
  padding: 8,
  borderBottom: "1px solid #334155"
};
