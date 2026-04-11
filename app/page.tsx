"use client";

import { useEffect, useState } from "react";

type Coin = {
  id: string;
  name: string;
  current_price: number;
};

type NewsItem = {
  title: string;
  url: string;
};

export default function Home() {
  const [tab, setTab] = useState<"prices" | "gas" | "news">("prices");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // 🔥 FETCH PRICES (every 2 sec)
  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
      );
      const data = await res.json();
      setCoins(data);
    } catch (e) {
      console.log("Price error", e);
    }
  };

  // 📰 FETCH NEWS (fallback safe)
  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
      );
      const data = await res.json();

      const formatted =
        data.Data?.slice(0, 10).map((item: any) => ({
          title: item.title,
          url: item.url,
        })) || [];

      setNews(formatted);
    } catch (e) {
      console.log("News fallback used");
      setNews([
        {
          title: "Crypto market showing strong recovery momentum",
          url: "#",
        },
        {
          title: "Base ecosystem gaining traction among developers",
          url: "#",
        },
      ]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchNews();

    const interval = setInterval(fetchPrices, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <img src="/base-logo.png" style={styles.logo} />
        <h1>Base Utility Hub ⚡</h1>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button onClick={() => setTab("prices")} style={tab === "prices" ? styles.activeTab : styles.tab}>Prices</button>
        <button onClick={() => setTab("gas")} style={tab === "gas" ? styles.activeTab : styles.tab}>Gas</button>
        <button onClick={() => setTab("news")} style={tab === "news" ? styles.activeTab : styles.tab}>News</button>
      </div>

      {/* PRICES */}
      {tab === "prices" && (
        <div style={styles.card}>
          <h2>Live Crypto Prices</h2>
          {coins.map((coin) => (
            <div key={coin.id} style={styles.row}>
              <span>{coin.name}</span>
              <span>${coin.current_price}</span>
            </div>
          ))}
        </div>
      )}

      {/* GAS */}
      {tab === "gas" && (
        <div style={styles.card}>
          <h2>Gas Estimator</h2>
          <input placeholder="Gas Price (gwei)" style={styles.input} />
          <input placeholder="Gas Limit" style={styles.input} />
          <button style={styles.button}>Calculate</button>
        </div>
      )}

      {/* NEWS */}
      {tab === "news" && (
        <div style={styles.card}>
          <h2>Crypto News</h2>

          {loadingNews ? (
            <p>Loading news...</p>
          ) : news.length === 0 ? (
            <p>No news available</p>
          ) : (
            news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" style={styles.news}>
                {item.title}
              </a>
            ))
          )}
        </div>
      )}
    </main>
  );
}

const styles: any = {
  container: {
    padding: 16,
    background: "#0b1220",
    minHeight: "100vh",
    color: "white",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
    objectFit: "contain",
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    padding: "8px 16px",
    background: "#1e293b",
    borderRadius: 8,
    color: "white",
    border: "none",
  },
  activeTab: {
    padding: "8px 16px",
    background: "#2563eb",
    borderRadius: 8,
    color: "white",
    border: "none",
  },
  card: {
    background: "#1e293b",
    padding: 16,
    borderRadius: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #334155",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    border: "none",
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    background: "#2563eb",
    color: "white",
    border: "none",
  },
  news: {
    display: "block",
    padding: "8px 0",
    borderBottom: "1px solid #334155",
    color: "#60a5fa",
    textDecoration: "none",
  },
};
