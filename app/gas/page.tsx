"use client";

import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "viem";

interface GasData {
  gasPriceWei: string;
  baseFeeWei: string | null;
  maxFeePerGasWei: string | null;
  maxPriorityFeePerGasWei: string | null;
  gasPriceGwei: string;
  baseFeeGwei: string | null;
  maxFeeGwei: string | null;
  maxPriorityFeeGwei: string | null;
  error?: string;
}

const TX_TYPES = [
  { label: "ETH Transfer", gasLimit: 21000 },
  { label: "ERC-20 Transfer", gasLimit: 65000 },
  { label: "Uniswap Swap", gasLimit: 150000 },
  { label: "NFT Mint", gasLimit: 100000 },
  { label: "Contract Deploy", gasLimit: 500000 },
  { label: "Custom", gasLimit: null },
];

function calcCostETH(gasPriceWei: string, gasLimit: number): string {
  const price = BigInt(gasPriceWei);
  const limit = BigInt(gasLimit);
  const costWei = price * limit;
  return parseFloat(formatUnits(costWei, 18)).toFixed(8);
}

function calcCostUSD(ethCost: string, ethPriceUSD: number): string {
  return (parseFloat(ethCost) * ethPriceUSD).toFixed(4);
}

export default function GasPage() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState(0);
  const [customGasLimit, setCustomGasLimit] = useState("100000");
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGas = useCallback(async () => {
    try {
      const res = await fetch("/api/gas", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "RPC error");
      setGasData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch gas data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch ETH price from CoinGecko (free public endpoint, no key needed)
  const fetchEthPrice = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        { next: { revalidate: 60 } }
      );
      const data = await res.json();
      if (data?.ethereum?.usd) setEthPrice(data.ethereum.usd);
    } catch {
      // Price optional – calculator still works without USD estimate
    }
  }, []);

  useEffect(() => {
    fetchGas();
    fetchEthPrice();
    const gasTimer = setInterval(fetchGas, 12000);
    const priceTimer = setInterval(fetchEthPrice, 60000);
    return () => {
      clearInterval(gasTimer);
      clearInterval(priceTimer);
    };
  }, [fetchGas, fetchEthPrice]);

  const isCustom = selectedType === TX_TYPES.length - 1;
  const gasLimit =
    isCustom
      ? parseInt(customGasLimit) || 21000
      : TX_TYPES[selectedType].gasLimit ?? 21000;

  const gasPriceWei = gasData?.gasPriceWei ?? "0";
  const ethCost = gasData ? calcCostETH(gasPriceWei, gasLimit) : null;
  const usdCost =
    ethCost && ethPrice ? calcCostUSD(ethCost, ethPrice) : null;

  // EIP-1559 max cost uses maxFeePerGas if available
  const maxFeeWei = gasData?.maxFeePerGasWei;
  const maxEthCost =
    gasData && maxFeeWei ? calcCostETH(maxFeeWei, gasLimit) : null;
  const maxUsdCost =
    maxEthCost && ethPrice ? calcCostUSD(maxEthCost, ethPrice) : null;

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between flex-wrap gap-sm">
          <div>
            <h1 className="page-title">⛽ Gas Calculator</h1>
            <p className="page-subtitle">
              Real gas prices from Base Mainnet — auto-refreshes every 12s
            </p>
          </div>
          <div className="flex gap-sm items-center">
            <span className="badge badge-green">
              <span className="dot dot-pulse" />
              Live
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { fetchGas(); fetchEthPrice(); }}
              disabled={loading}
            >
              {loading ? <span className="loading-spinner" /> : "↻"}
            </button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-muted mt-sm">
            Updated {lastUpdated.toLocaleTimeString()}
            {ethPrice && ` · ETH $${ethPrice.toLocaleString()}`}
          </p>
        )}
      </div>

      {error && (
        <div className="info-box info-box-red mb-lg">⚠️ {error}</div>
      )}

      {/* Live gas prices */}
      <div className="section-header">
        <span className="section-title">Live Gas Prices</span>
      </div>

      {loading && !gasData ? (
        <div className="grid-4 mb-lg">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: 11, width: 70, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 26, width: 110 }} />
            </div>
          ))}
        </div>
      ) : gasData ? (
        <div className="grid-4 mb-lg">
          <div className="stat-card card-accent">
            <div className="stat-label">Gas Price</div>
            <div className="stat-value">
              {gasData.gasPriceGwei}
              <span className="stat-unit">Gwei</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Base Fee</div>
            <div className="stat-value">
              {gasData.baseFeeGwei ?? "—"}
              {gasData.baseFeeGwei && <span className="stat-unit">Gwei</span>}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max Fee</div>
            <div className="stat-value">
              {gasData.maxFeeGwei ?? "—"}
              {gasData.maxFeeGwei && <span className="stat-unit">Gwei</span>}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Priority Fee</div>
            <div className="stat-value">
              {gasData.maxPriorityFeeGwei ?? "—"}
              {gasData.maxPriorityFeeGwei && <span className="stat-unit">Gwei</span>}
            </div>
          </div>
        </div>
      ) : null}

      {/* Calculator */}
      <div className="section-header mt-md">
        <span className="section-title">Cost Estimator</span>
      </div>
      <div className="card">
        <div className="input-group">
          <label className="input-label">Transaction Type</label>
          <div className="flex flex-wrap gap-sm">
            {TX_TYPES.map((t, i) => (
              <button
                key={t.label}
                className={`btn btn-sm ${selectedType === i ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSelectedType(i)}
              >
                {t.label}
                {t.gasLimit && (
                  <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 4 }}>
                    {t.gasLimit.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isCustom && (
          <div className="input-group">
            <label className="input-label">Custom Gas Limit</label>
            <input
              className="input"
              type="number"
              min="21000"
              max="30000000"
              value={customGasLimit}
              onChange={(e) => setCustomGasLimit(e.target.value)}
              placeholder="e.g. 200000"
            />
          </div>
        )}

        {!isCustom && (
          <p className="text-sm text-muted mb-md">
            Gas limit: <span className="mono">{gasLimit.toLocaleString()}</span> units
          </p>
        )}

        <div className="gas-result">
          <div className="gas-result-row">
            <span className="gas-result-label">Gas Limit</span>
            <span className="gas-result-value mono">{gasLimit.toLocaleString()} gas</span>
          </div>
          <div className="gas-result-row">
            <span className="gas-result-label">Gas Price (live)</span>
            <span className="gas-result-value mono">
              {gasData?.gasPriceGwei ?? "—"} Gwei
            </span>
          </div>
          <div className="gas-result-row">
            <span className="gas-result-label">Estimated Cost (ETH)</span>
            <span className="gas-result-value mono" style={{ color: "var(--base-blue)" }}>
              {ethCost ? `${ethCost} ETH` : "—"}
            </span>
          </div>
          {usdCost && (
            <div className="gas-result-row">
              <span className="gas-result-label">Estimated Cost (USD)</span>
              <span className="gas-result-value mono" style={{ color: "var(--green)" }}>
                ≈ ${usdCost}
              </span>
            </div>
          )}
          <div className="gas-result-row">
            <span className="gas-result-label">Max Cost — EIP-1559 (ETH)</span>
            <span className="gas-result-value mono">
              {maxEthCost ? `${maxEthCost} ETH` : "—"}
            </span>
          </div>
          {maxUsdCost && (
            <div className="gas-result-row">
              <span className="gas-result-label">Max Cost — EIP-1559 (USD)</span>
              <span className="gas-result-value mono">≈ ${maxUsdCost}</span>
            </div>
          )}
        </div>

        {!ethPrice && !loading && (
          <p className="text-sm text-muted mt-sm">
            USD estimates unavailable — CoinGecko price not loaded yet.
          </p>
        )}
      </div>

      <div className="info-box info-box-blue mt-lg">
        Base uses EIP-1559. You pay <strong>base fee + priority fee</strong>. Base fee is
        burned; only the priority fee goes to the sequencer. On Base, fees are
        typically far lower than Ethereum mainnet.
      </div>
    </div>
  );
}
