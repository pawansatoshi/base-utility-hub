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

  // ETH price
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr")
      .then(res => res.json())
      .then(data => setEthPrice(data.ethereum.inr));
  }, []);

  // Coins
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&per_page=50")
      .then(res => res.json())
      .then(data => setCoins(data));
  }, []);

  // News
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
    <div style={{ padding: 20, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      
      <h1>Base Utility Hub ⚡</h1>
      <img src="/base-logo.png" width="50" />

      {/* Tabs */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("gas")} style={{ marginRight: 10 }}>Gas</button>
        <button onClick={() => setTab("prices")} style={{ marginRight: 10 }}>Prices</button>
        <button onClick={() => setTab("news")}>News</button>
      </div>

      {/* GAS */}
      {tab === "gas" && (
        <div>
          <input
            placeholder="Gas Price (gwei)"
            value={gasPrice}
            onChange={(e) => setGasPrice(e.target.value)}
            style={{ display: "block", marginBottom: 10 }}
          />

          <input
            placeholder="Gas Limit"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
            style={{ display: "block", marginBottom: 10 }}
          />

          <button onClick={() => calculateFee()}>Calculate</button>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => calculateFee(10)}>Low</button>
            <button onClick={() => calculateFee(20)}>Medium</button>
            <button onClick={() => calculateFee(30)}>High</button>
          </div>

          <p>{result}</p>
          <p>ETH Price: ₹{ethPrice}</p>
        </div>
      )}

      {/* PRICES */}
      {tab === "prices" && (
        <div>
          {coins.map((c) => (
            <div key={c.id}>
              {c.name} - ₹{c.current_price}
            </div>
          ))}
        </div>
      )}

      {/* NEWS */}
      {tab === "news" && (
        <div>
          {news.map((n, i) => (
            <div key={i}>
              <a href={n.url} target="_blank">
                {n.title}
              </a>
            </div>
          ))}
        </div>
      )}

    </div>
  );
  }
