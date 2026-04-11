"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tab, setTab] = useState("gas");

  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [result, setResult] = useState("");
  const [ethPrice, setEthPrice] = useState(0);

  const [coins, setCoins] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  // ETH PRICE
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr")
      .then(res => res.json())
      .then(data => setEthPrice(data.ethereum.inr));
  }, []);

  // TOP COINS
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&per_page=50")
      .then(res => res.json())
      .then(data => setCoins(data));
  }, []);

  // NEWS
  useEffect(() => {
    fetch("https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true")
      .then(res => res.json())
      .then(data => setNews(data.results));
  }, []);

  const calculateFee = (price?: number) => {
    const p = price || parseFloat(gasPrice);
    const l = parseFloat(gasLimit);

    if (!p || !l) {
      setResult("Enter valid values");
      return;
    }

    const feeETH = (p * l) / 1e9;
    const feeINR = feeETH * ethPrice;

    setResult(`Fee: ${feeETH.toFixed(6)} ETH (~₹${feeINR.toFixed(2)})`);
  };

  return (
    <div style={{
      padding: 20,
      background: "#0f172a",
      color: "white",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20
      }}>
        <img src="/base-logo.png" width="40" />
        <h1 style={{ fontSize: "18px", margin: 0 }}>
          Base Utility Hub ⚡
        </h1>
      </div>

      {/* TABS */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("gas")} style={tabBtn}>Gas</button>
        <button onClick={() => setTab("prices")} style={tabBtn}>Prices</button>
        <button onClick={() => setTab("news")} style={tabBtn}>News</button>
      </div>

      {/* CONTENT CARD */}
      <div style={card}>

        {/* GAS TAB */}
        {tab === "gas" && (
          <>
            <h2>Gas Fee Estimator</h2>

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
            <p>ETH Price: ₹{ethPrice}</p>
          </>
        )}

        {/* PRICES TAB */}
        {tab === "prices" && (
          <>
            <h2>Top 50 Crypto Prices</h2>
            {coins.map((c) => (
              <div key={c.id} style={listItem}>
                {c.name} — ₹{c.current_price}
              </div>
            ))}
          </>
        )}

        {/* NEWS TAB */}
        {tab === "news" && (
          <>
            <h2>Crypto News</h2>
            {news.map((n, i) => (
              <div key={i} style={listItem}>
                <a href={n.url} target="_blank" style={{ color: "#38bdf8" }}>
                  {n.title}
                </a>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* STYLES */

const tabBtn = {
  marginRight: 10,
  padding: 8,
  borderRadius: 6,
  cursor: "pointer"
};

const card = {
  background: "#1e293b",
  padding: 15,
  borderRadius: 12
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
  marginTop: 5,
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
