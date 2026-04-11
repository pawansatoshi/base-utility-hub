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

export default function Home() {
  const [tab, setTab] = useState<"prices" | "gas" | "news">("prices");

  const [coins, setCoins] = useState<Coin[]>([]);
  const [displayCoins, setDisplayCoins] = useState<Coin[]>([]);

  const [ethPrice, setEthPrice] = useState(0);
  const [displayEth, setDisplayEth] = useState(0);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);

  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [result, setResult] = useState("");

  /* ---------------- WALLET ---------------- */

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts[0]);
    } else {
      alert("Install MetaMask / OKX / Coinbase Wallet");
    }
  };

  /* ---------------- FETCH DATA ---------------- */

  const fetchCoins = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20&page=1",
        { cache: "no-store" }
      );
      const data = await res.json();
      setCoins(data);
      setDisplayCoins(data);
    } catch {}
  };

  const fetchETH = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        { cache: "no-store" }
      );
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
      setDisplayEth(data.ethereum.usd);
    } catch {}
  };

  /* ---------------- AUTO REFRESH ---------------- */

  useEffect(() => {
    fetchCoins();
    fetchETH();

    const interval = setInterval(() => {
      fetchCoins();
      fetchETH();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- 2s LIVE EFFECT ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCoins((prev) =>
        prev.map((coin) => ({
          ...coin,
          current_price:
            coin.current_price *
            (1 + (Math.random() - 0.5) * 0.002),
        }))
      );

      setDisplayEth((prev) =>
        prev * (1 + (Math.random() - 0.5) * 0.002)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- NEWS ---------------- */

  useEffect(() => {
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const formatted = data.items.map((n: any) => ({
            title: n.title,
            url: n.link,
            source: "Cointelegraph",
          }));
          setNews(formatted);
        }
      })
      .catch(() => setNews([]));
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const openUniswap = () =>
    window.open("https://app.uniswap.org/#/swap?chain=base", "_blank");

  const openBridge = () =>
    window.open("https://bridge.base.org", "_blank");

  const openExchange = () =>
    window.open("https://www.coinbase.com/buy", "_blank");

  /* ---------------- GAS ---------------- */

  const calculateFee = () => {
    const p = parseFloat(gasPrice);
    const l = parseFloat(gasLimit);

    if (!p || !l) {
      setResult("Enter valid values");
      return;
    }

    const feeETH = (p * l) / 1e9;
    const feeUSD = feeETH * displayEth;

    setResult(`${feeETH.toFixed(6)} ETH (~$${feeUSD.toFixed(2)})`);
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <Image src="/base-logo.png" alt="logo" width={32} height={32} />
        <h2>Base Utility Hub ⚡</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={() => { fetchCoins(); fetchETH(); }} style={btn}>
            Refresh
          </button>

          {wallet ? (
            <span style={{ fontSize: 12 }}>
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
          ) : (
            <button onClick={connectWallet} style={btn}>
              Connect
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={tabs}>
        {["prices", "gas", "news"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            style={tab === t ? activeTab : tabBtn}
          >
            {t === "prices" ? "LIVE PRICES" : t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRICES */}
      {tab === "prices" && (
        <div style={card}>
          <h3>Live Crypto Prices</h3>

          {displayCoins.map((coin) => {
            const change = coin.current_price - (coins.find(c=>c.id===coin.id)?.current_price || coin.current_price);
            const color = change >= 0 ? "#22c55e" : "#ef4444";

            return (
              <div key={coin.id} style={row}>
                <span>
                  {coin.name} —{" "}
                  <span style={{ color }}>
                    ${coin.current_price.toFixed(2)}
                  </span>
                </span>

                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={openUniswap} style={smallBtn}>Buy</button>
                  <button onClick={openUniswap} style={smallBtn}>Swap</button>
                  <button onClick={openBridge} style={smallBtn}>Bridge</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GAS */}
      {tab === "gas" && (
        <div style={card}>
          <h3>Gas Fee Estimator</h3>

          <input placeholder="Gas Price" onChange={(e)=>setGasPrice(e.target.value)} style={input}/>
          <input placeholder="Gas Limit" onChange={(e)=>setGasLimit(e.target.value)} style={input}/>

          <button onClick={calculateFee} style={btn}>Calculate</button>

          <p>{result}</p>
        </div>
      )}

      {/* NEWS */}
      {tab === "news" && (
        <div style={card}>
          <h3>Crypto News</h3>

          {news.length === 0 ? (
            <p>No news available</p>
          ) : (
            news.map((n, i) => (
              <a key={i} href={n.url} target="_blank" style={newsItem}>
                {n.title}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = { padding:16, background:"#0f172a", color:"white", minHeight:"100vh" };
const header = { display:"flex", alignItems:"center", gap:10 };
const tabs = { marginTop:16, display:"flex", gap:10 };
const tabBtn = { padding:"8px 12px", background:"#1e293b", borderRadius:8, color:"white", border:"none" };
const activeTab = { ...tabBtn, background:"#2563eb" };
const card = { marginTop:20, background:"#1e293b", padding:16, borderRadius:12 };
const row = { display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #334155" };
const btn = { padding:"8px 12px", background:"#2563eb", border:"none", borderRadius:6, color:"white" };
const smallBtn = { padding:"4px 8px", background:"#334155", border:"none", borderRadius:6, color:"white" };
const input = { width:"100%", padding:8, marginBottom:10 };
const newsItem = { display:"block", padding:"8px 0", borderBottom:"1px solid #334155", color:"white" };
