"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useReadContract,
} from "wagmi";
import { parseAbi, isAddress } from "viem";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const USDC_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function ConnectedWallet({ address }: { address: `0x${string}` }) {
  const { disconnect } = useDisconnect();

  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
    chainId: 8453,
  });

  const { data: usdcRaw, isLoading: usdcLoading } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: 8453,
  });

  const usdcBalance = usdcRaw !== undefined
    ? (Number(usdcRaw) / 1e6).toFixed(2)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-sm mb-lg">
        <div>
          <div className="card-label">Connected Address</div>
          <div className="mono" style={{ fontSize: 14, color: "var(--text-primary)", wordBreak: "break-all" }}>
            {address}
          </div>
        </div>
        <div className="flex gap-sm flex-wrap">
          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            Basescan ↗
          </a>
          <button onClick={() => disconnect()} className="btn btn-ghost btn-sm">
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="balance-card">
          <div
            className="balance-icon"
            style={{ background: "rgba(0,82,255,0.12)" }}
          >
            Ξ
          </div>
          <div>
            <div className="balance-token">ETH (Base)</div>
            {ethLoading ? (
              <div className="skeleton" style={{ height: 28, width: 120, marginTop: 4 }} />
            ) : (
              <div className="balance-amount">
                {ethBalance
                  ? parseFloat(ethBalance.formatted).toFixed(6)
                  : "0.000000"}
              </div>
            )}
          </div>
        </div>

        <div className="balance-card">
          <div
            className="balance-icon"
            style={{ background: "rgba(0,112,240,0.12)" }}
          >
            $
          </div>
          <div>
            <div className="balance-token">USDC (Base)</div>
            {usdcLoading ? (
              <div className="skeleton" style={{ height: 28, width: 120, marginTop: 4 }} />
            ) : (
              <div className="balance-amount">{usdcBalance ?? "0.00"}</div>
            )}
          </div>
        </div>
      </div>

      <div className="info-box info-box-blue mt-lg">
        Balances shown for Base Mainnet (Chain ID 8453). USDC contract:{" "}
        <a
          href={`https://basescan.org/token/${USDC_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link mono"
        >
          {shortAddr(USDC_ADDRESS)}
        </a>
      </div>
    </div>
  );
}

function AddressLookup() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    eth: string;
    usdc: string;
  } | null>(null);

  const lookup = async () => {
    if (!isAddress(input.trim())) {
      setError("Enter a valid Ethereum address (0x…)");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setAddress(input.trim());
    try {
      const res = await fetch(`/api/wallet?address=${input.trim()}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Lookup failed");
      setResult({ eth: data.eth, usdc: data.usdc });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="input-group">
        <label className="input-label">Wallet Address</label>
        <div className="input-row">
          <input
            className="input"
            placeholder="0x..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <button
            className="btn btn-primary"
            onClick={lookup}
            disabled={loading || !input}
          >
            {loading ? <span className="loading-spinner" /> : "Check"}
          </button>
        </div>
      </div>

      {error && <div className="info-box info-box-red mb-md">{error}</div>}

      {result && address && (
        <div className="explorer-result">
          <div className="flex items-center justify-between flex-wrap gap-sm mb-md">
            <span className="card-label">Balances on Base Mainnet</span>
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Basescan ↗
            </a>
          </div>
          <div className="grid-2">
            <div className="balance-card">
              <div className="balance-icon" style={{ background: "rgba(0,82,255,0.12)" }}>Ξ</div>
              <div>
                <div className="balance-token">ETH</div>
                <div className="balance-amount">
                  {parseFloat(result.eth).toFixed(6)}
                </div>
              </div>
            </div>
            <div className="balance-card">
              <div className="balance-icon" style={{ background: "rgba(0,112,240,0.12)" }}>$</div>
              <div>
                <div className="balance-token">USDC</div>
                <div className="balance-amount">
                  {parseFloat(result.usdc).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted mt-md mono truncate">
            {address}
          </p>
        </div>
      )}
    </div>
  );
}

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👛 Wallet Checker</h1>
        <p className="page-subtitle">
          Check ETH and USDC balances on Base Mainnet
        </p>
      </div>

      {/* Connect section */}
      <div className="section-header">
        <span className="section-title">Connect Wallet</span>
        {isConnected && (
          <span className="badge badge-green">
            <span className="dot" /> Connected
          </span>
        )}
      </div>

      {isConnected && address ? (
        <div className="card card-accent mb-lg">
          <ConnectedWallet address={address} />
        </div>
      ) : (
        <div className="card mb-lg">
          <p className="text-secondary mb-md" style={{ fontSize: 13 }}>
            Connect a wallet to automatically load your Base balances. Works with
            MetaMask, Coinbase Wallet, and Farcaster Mini App.
          </p>
          <div className="flex flex-wrap gap-sm">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className="btn btn-secondary"
                onClick={() => connect({ connector })}
                disabled={isPending}
              >
                {isPending ? <span className="loading-spinner" /> : null}
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="divider" />

      {/* Manual lookup */}
      <div className="section-header">
        <span className="section-title">Address Lookup</span>
        <span className="badge badge-blue">No wallet needed</span>
      </div>
      <div className="card">
        <AddressLookup />
      </div>
    </div>
  );
}
