"use client";

import { useEffect, useState, useCallback } from "react";

interface NetworkData {
  blockNumber: string;
  timestamp: number;
  gasPrice: string;
  baseFee: string | null;
  maxFee: string | null;
  maxPriorityFee: string | null;
  txCount: number;
  chainId: number;
  chainName: string;
  nativeCurrency: string;
  rpcUrl: string;
  explorerUrl: string;
  error?: string;
}

function timeAgo(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

function SkeletonCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 28, width: 140 }} />
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNetwork = useCallback(async () => {
    try {
      const res = await fetch("/api/network", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to fetch");
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetwork();
    const id = setInterval(fetchNetwork, 12000); // ~Base block time
    return () => clearInterval(id);
  }, [fetchNetwork]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between flex-wrap gap-sm">
          <div>
            <h1 className="page-title">⛓️ Network Dashboard</h1>
            <p className="page-subtitle">
              Live Base Mainnet stats — auto-refreshes every 12 seconds
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <span className="badge badge-green">
              <span className="dot dot-pulse" />
              Live
            </span>
            <button
              onClick={fetchNetwork}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              {loading ? <span className="loading-spinner" /> : "↻ Refresh"}
            </button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-muted mt-sm">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {error && (
        <div className="info-box info-box-red mb-lg">
          ⚠️ {error} — retrying automatically.
        </div>
      )}

      {/* Primary stats */}
      {loading && !data ? (
        <div className="grid-4 mb-lg">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data ? (
        <>
          <div className="grid-4 mb-lg">
            <div className="stat-card card-accent">
              <div className="stat-label">Block Number</div>
              <div className="stat-value">
                {parseInt(data.blockNumber).toLocaleString()}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Gas Price</div>
              <div className="stat-value">
                {data.gasPrice}
                <span className="stat-unit">Gwei</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Base Fee</div>
              <div className="stat-value">
                {data.baseFee ?? "—"}
                {data.baseFee && <span className="stat-unit">Gwei</span>}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Txs in Block</div>
              <div className="stat-value">{data.txCount}</div>
            </div>
          </div>

          {/* EIP-1559 fee row */}
          <div className="grid-2 mb-lg">
            <div className="stat-card">
              <div className="stat-label">Max Fee Per Gas</div>
              <div className="stat-value">
                {data.maxFee ?? "—"}
                {data.maxFee && <span className="stat-unit">Gwei</span>}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Max Priority Fee (tip)</div>
              <div className="stat-value">
                {data.maxPriorityFee ?? "—"}
                {data.maxPriorityFee && <span className="stat-unit">Gwei</span>}
              </div>
            </div>
          </div>

          {/* Block timestamp */}
          <div className="stat-card mb-lg">
            <div className="stat-label">Latest Block Timestamp</div>
            <div className="stat-value" style={{ fontSize: 17 }}>
              {new Date(data.timestamp * 1000).toUTCString()}
              <span className="stat-unit">({timeAgo(data.timestamp)})</span>
            </div>
          </div>

          {/* Chain info table */}
          <div className="section-header">
            <span className="section-title">Chain Information</span>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {[
                    ["Network Name", data.chainName],
                    ["Chain ID", data.chainId.toString()],
                    ["Native Currency", data.nativeCurrency],
                    ["RPC Endpoint", data.rpcUrl],
                    ["Block Explorer", data.explorerUrl],
                    ["USDC Address", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="td-label" style={{ width: "35%", whiteSpace: "nowrap" }}>
                        {label}
                      </td>
                      <td className="truncate" style={{ maxWidth: 260 }}>
                        {value === data.explorerUrl || value === data.rpcUrl ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Basescan link */}
          <div className="mt-lg">
            <a
              href={`https://basescan.org/block/${data.blockNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View Block #{parseInt(data.blockNumber).toLocaleString()} on Basescan →
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
