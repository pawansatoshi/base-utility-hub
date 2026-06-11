import { NextResponse } from "next/server";
import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function GET() {
  try {
    const blockNumber = await client.getBlockNumber();
    const [block, gasPrice, feeData] = await Promise.all([
      client.getBlock({ blockNumber }),
      client.getGasPrice(),
      client.estimateFeesPerGas().catch(() => null),
    ]);

    const gasPriceGwei = parseFloat(formatUnits(gasPrice, 9));
    const baseFeeGwei = block.baseFeePerGas
      ? parseFloat(formatUnits(block.baseFeePerGas, 9))
      : null;
    const maxFeeGwei =
      feeData?.maxFeePerGas
        ? parseFloat(formatUnits(feeData.maxFeePerGas, 9))
        : null;
    const maxPriorityGwei =
      feeData?.maxPriorityFeePerGas
        ? parseFloat(formatUnits(feeData.maxPriorityFeePerGas, 9))
        : null;

    return NextResponse.json(
      {
        blockNumber: blockNumber.toString(),
        timestamp: Number(block.timestamp),
        gasPrice: gasPriceGwei.toFixed(5),
        baseFee: baseFeeGwei !== null ? baseFeeGwei.toFixed(5) : null,
        maxFee: maxFeeGwei !== null ? maxFeeGwei.toFixed(5) : null,
        maxPriorityFee:
          maxPriorityGwei !== null ? maxPriorityGwei.toFixed(5) : null,
        txCount: block.transactions.length,
        chainId: base.id,
        chainName: "Base Mainnet",
        nativeCurrency: base.nativeCurrency.symbol,
        rpcUrl: "https://mainnet.base.org",
        explorerUrl: "https://basescan.org",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "RPC error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
