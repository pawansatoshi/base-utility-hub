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
    const [gasPrice, block, feeData] = await Promise.all([
      client.getGasPrice(),
      client.getBlock().catch(() => null),
      client.estimateFeesPerGas().catch(() => null),
    ]);

    const baseFee = block?.baseFeePerGas ?? null;

    return NextResponse.json(
      {
        // Raw wei strings for precise client-side math
        gasPriceWei: gasPrice.toString(),
        baseFeeWei: baseFee?.toString() ?? null,
        maxFeePerGasWei: feeData?.maxFeePerGas?.toString() ?? null,
        maxPriorityFeePerGasWei:
          feeData?.maxPriorityFeePerGas?.toString() ?? null,
        // Gwei for display
        gasPriceGwei: parseFloat(formatUnits(gasPrice, 9)).toFixed(6),
        baseFeeGwei: baseFee
          ? parseFloat(formatUnits(baseFee, 9)).toFixed(6)
          : null,
        maxFeeGwei: feeData?.maxFeePerGas
          ? parseFloat(formatUnits(feeData.maxFeePerGas, 9)).toFixed(6)
          : null,
        maxPriorityFeeGwei: feeData?.maxPriorityFeePerGas
          ? parseFloat(
              formatUnits(feeData.maxPriorityFeePerGas, 9)
            ).toFixed(6)
          : null,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "RPC error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
