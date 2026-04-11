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

  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [result, setResult] = useState("");

  // ✅ FETCH PRICES (every 2 sec)
  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20",
        { cache: "no-store" }
      );
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.log("price error");
    }
  };

  // ✅ FETCH NEWS (safe fallback)
  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
      );
      const data = await res.json();

      const formatted: NewsItem[] =
        data?.Data?.slice(0, 10).map((item: { title: string; url: string }) => ({
          title: item.title,
          url: item.url,
        })) || [];

      setNews(formatted);
    } catch (err) {
      setNews([
        { title: "Crypto market showing recovery", url: "#" },
        { title: "Base ecosystem growing fast", url: "#" },
      ]);
    } finally {
      setLoadingNews(false);
    }
  };

  // ✅ AUTO REFRESH
  useEffect(() => {
    fetchPrices();
    fetchNews();

    const interval = setInterval(fetchPrices, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ GAS CALCULATION
  const calculateGas = () => {
    const p = parseFloat(gasPrice);
    const l = parseFloat(gasLimit);

    if (!p || !l) {
      setResult("Enter valid values");
      return;
    }

    const feeETH = (p * l) / 1e9;
    setResult(`${feeETH.toFixed(6)} ETH`);
  };

  return (
    <main style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <img src="/base-logo.png" style={styles.logo} />
        <h2>Base Utility Hub ⚡</h2>
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
          <h3>Live Crypto Prices</h3>
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
          <h3>Gas Estimator</h3>
          <input placeholder="Gas Price" onChange={(e) => setGasPrice(e.target.value)} style={styles.input} />
          <input placeholder="Gas Limit" onChange={(e) => setGasLimit(e.target.value)} style={styles.input} />
          <button onClick={calculateGas} style={styles.button}>Calculate</button>
          <p>{result}</p>
        </div>
      )}

      {/* NEWS */}
      {tab === "news" && (
        <div style={styles.card}>
          <h3>Crypto News</h3>

          {loadingNews ? (
            <p>Loading...</p>
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

/* STYLES */
const styles: any = {
  container: {
    padding: 16,
    background: "#0b1220",
    minHeight: "100vh",
    color: "white",
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
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    padding: "8px 14px",
    background: "#1e293b",
    border: "none",
    borderRadius: 8,
    color: "white",
  },
  activeTab: {
    padding: "8px 14px",
    background: "#2563eb",
    border: "none",
    borderRadius: 8,
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: 16,
    borderRadius: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
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
    background: "#2563eb",
    border: "none",
    borderRadius: 6,
    color: "white",
  },
  news: {
    display: "block",
    marginTop: 10,
    color: "#60a5fa",
    textDecoration: "none",
  },
};
