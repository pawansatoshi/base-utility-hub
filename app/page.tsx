"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";

/* ---------------- TYPES ---------------- */

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

type ApiNews = {
  title: string;
  url: string;
  source?: {
    title: string;
  };
};

/* ---------------- COMPONENT ---------------- */

export default function Home() {
  const [tab, setTab] = useState<"gas" | "prices" | "news">("gas");

  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [result, setResult] = useState("");

  const [ethPrice, setEthPrice] = useState<number>(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  /* ---------------- ETH PRICE AUTO REFRESH ---------------- */

  useEffect(() => {
    const fetchETH = () => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
        .then((res) => res.json())
        .then((data) => setEthPrice(data.ethereum.usd))
        .catch(() => setEthPrice(0));
    };

    fetchETH();
    const interval = setInterval(fetchETH, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- COINS AUTO REFRESH ---------------- */

  useEffect(() => {
    const fetchCoins = () => {
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
      )
        .then((res) => res.json())
        .then((data: Coin[]) => setCoins(data))
        .catch(() => setCoins([]));
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- NEWS FIXED ---------------- */

  useEffect(() => {
    fetch(
      "https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true"
    )
      .then((res) => res.json())
      .then((data: { results: ApiNews[] }) => {
        if (data?.results) {
          const formatted: NewsItem[] = data.results.map((n) => ({
            title: n.title,
            url: n.url,
            source: n.source?.title || "Unknown",
          }));

          setNews(formatted);
        }
      })
      .catch(() => setNews([]));
  }, []);

  /* ---------------- GAS CALC ---------------- */

  const calculateFee = () => {
    const p = parseFloat(gasPrice);
    const l = parseFloat(gasLimit);

    if (!p || !l) {
      setResult("Enter valid values");
      return;
    }

    const feeETH = (p * l) / 1e9;
    const feeUSD = feeETH * ethPrice;

    setResult(`${feeETH.toFixed(6)} ETH (~$${feeUSD.toFixed(2)})`);
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "system-ui",
        padding: 16,
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/base-logo.png"
          alt="Base Logo"
          width={32}
          height={32}
        />
        <h2 style={{ margin: 0 }}>Base Utility Hub ⚡</h2>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        {["gas", "prices", "news"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "gas" | "prices" | "news")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: tab === t ? "#2563eb" : "#1e293b",
              color: "white",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------------- GAS ---------------- */}
      {tab === "gas" && (
        <div style={cardStyle}>
          <h3>Gas Fee Estimator</h3>

          <input
            placeholder="Gas Price (gwei)"
            value={gasPrice}
            onChange={(e) => setGasPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Gas Limit"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
            style={inputStyle}
          />

          <button onClick={calculateFee} style={btnStyle}>
            Calculate
          </button>

          <p>ETH Price: ${ethPrice}</p>
          <p>{result}</p>
        </div>
      )}

      {/* ---------------- PRICES ---------------- */}
      {tab === "prices" && (
        <div style={cardStyle}>
          <h3>Top Crypto Prices</h3>

          {coins.map((c) => (
            <div key={c.id} style={rowStyle}>
              <span>{c.name}</span>
              <span>${c.current_price}</span>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- NEWS ---------------- */}
      {tab === "news" && (
        <div style={cardStyle}>
          <h3>Crypto News</h3>

          {news.length === 0 ? (
            <p>No news available</p>
          ) : (
            news.map((n, i) => (
              <a
                key={i}
                href={n.url}
                target="_blank"
                style={newsStyle}
              >
                <strong>{n.title}</strong>
                <br />
                <small style={{ color: "#94a3b8" }}>{n.source}</small>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const cardStyle: React.CSSProperties = {
  marginTop: 20,
  padding: 16,
  background: "#1e293b",
  borderRadius: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "none",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 14px",
  background: "#2563eb",
  border: "none",
  borderRadius: 6,
  color: "white",
  cursor: "pointer",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #334155",
};

const newsStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 0",
  borderBottom: "1px solid #334155",
  color: "white",
  textDecoration: "none",
};
