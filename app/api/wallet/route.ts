import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  http,
  formatUnits,
  isAddress,
  parseAbi,
} from "viem";
import { base } from "viem/chains";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// USDC on Base Mainnet (official)
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]);

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address param required" }, { status: 400 });
  }
  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 });
  }

  try {
    const [ethBalance, usdcRaw] = await Promise.all([
      client.getBalance({ address }),
      client.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      }),
    ]);

    return NextResponse.json(
      {
        address,
        eth: formatUnits(ethBalance, 18),
        ethRaw: ethBalance.toString(),
        usdc: formatUnits(usdcRaw as bigint, 6),
        usdcRaw: (usdcRaw as bigint).toString(),
        usdcAddress: USDC_ADDRESS,
        chainId: base.id,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "RPC error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
