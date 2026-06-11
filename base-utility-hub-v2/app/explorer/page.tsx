"use client";

import { useState } from "react";

type ResultType = "tx" | "address";

interface SearchResult {
  type: ResultType;
  value: string;
}

function isValidTxHash(val: string) {
  return /^0x[0-9a-fA-F]{64}$/.test(val.trim());
}

function isValidAddress(val: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(val.trim());
}

function shortHash(h: string) {
  return `${h.slice(0, 10)}…${h.slice(-8)}`;
}

export default function ExplorerPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = () => {
    const val = input.trim();
    setError(null);
    setResult(null);

    if (!val) {
      setError("Enter a transaction hash or wallet address.");
      return;
    }
    if (isValidTxHash(val)) {
      setResult({ type: "tx", value: val });
    } else if (isValidAddress(val)) {
      setResult({ type: "address", value: val });
    } else {
      setError(
        "Not recognised. Enter a valid tx hash (0x + 64 hex chars) or address (0x + 40 hex chars)."
      );
    }
  };

  const explorerUrl =
    result?.type === "tx"
      ? `https://basescan.org/tx/${result.value}`
      : result?.type === "address"
      ? `https://basescan.org/address/${result.value}`
      : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🔍 Transaction Explorer</h1>
        <p className="page-subtitle">
          Search any transaction hash or wallet address on Base Mainnet
        </p>
      </div>

      <div className="card mb-lg">
        <div className="input-group">
          <label className="input-label">Transaction Hash or Wallet Address</label>
          <div className="input-row">
            <input
              className="input"
              placeholder="0x..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              className="btn btn-primary"
              onClick={search}
              disabled={!input.trim()}
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="info-box info-box-red mt-md">{error}</div>
        )}
      </div>

      {result && explorerUrl && (
        <div className="explorer-result">
          <div className="flex items-center justify-between flex-wrap gap-sm mb-md">
            <span className="badge badge-blue">
              {result.type === "tx" ? "Transaction" : "Wallet Address"}
            </span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Open on Basescan ↗
            </a>
          </div>

          <div className="table-wrap">
            <table className="table">
              <tbody>
                <tr>
                  <td className="td-label" style={{ width: "30%" }}>Type</td>
                  <td>{result.type === "tx" ? "Transaction Hash" : "Wallet / Contract Address"}</td>
                </tr>
                <tr>
                  <td className="td-label">Value</td>
                  <td className="mono" style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
                    {result.value}
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Network</td>
                  <td>Base Mainnet (Chain ID 8453)</td>
                </tr>
                <tr>
                  <td className="td-label">Explorer</td>
                  <td>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link mono"
                    >
                      {explorerUrl}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {result.type === "address" && (
            <div className="flex flex-wrap gap-sm mt-lg">
              <a
                href={`https://basescan.org/address/${result.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Address Overview ↗
              </a>
              <a
                href={`https://basescan.org/address/${result.value}#internaltx`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Internal Txs ↗
              </a>
              <a
                href={`https://basescan.org/address/${result.value}#tokentxns`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Token Transfers ↗
              </a>
            </div>
          )}
        </div>
      )}

      <hr className="divider" />

      <div className="section-header">
        <span className="section-title">Quick Links</span>
      </div>
      <div className="grid-2">
        {[
          { label: "Basescan Home", href: "https://basescan.org", desc: "Full block explorer for Base Mainnet" },
          { label: "Latest Blocks", href: "https://basescan.org/blocks", desc: "Browse recently confirmed blocks" },
          { label: "Latest Transactions", href: "https://basescan.org/txs", desc: "Live feed of transactions" },
          { label: "Verified Contracts", href: "https://basescan.org/contractsVerified", desc: "Browse verified smart contracts" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="dir-card"
          >
            <div className="dir-card-icon">🔗</div>
            <div className="dir-card-body">
              <div className="dir-card-title">{link.label}</div>
              <div className="dir-card-desc">{link.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
