<script lang="ts">
  import { Connection } from "@solana/web3.js";
  import {
    WhirlpoolAccountFetcher,
    PriceMath,
    WhirlpoolData,
    DEFAULT_WHIRLPOOL_RETENTION_POLICY,
    PREFER_CACHE,
  } from "@orca-so/whirlpools-sdk";
  import { SimpleAccountFetcher } from "@orca-so/common-sdk";
  import Decimal from "decimal.js";
  import { rpcConnection } from "../../stores/index";
  import { ORCA_USDC_64_PUBKEY } from "../../lib/constants";

  const fetcher = new WhirlpoolAccountFetcher($rpcConnection, new SimpleAccountFetcher($rpcConnection, DEFAULT_WHIRLPOOL_RETENTION_POLICY));

  const getPrice = async (poolData: WhirlpoolData): Promise<Decimal> => {
    const mints = await fetcher.getMintInfos(
      [poolData.tokenMintA, poolData.tokenMintB],
      PREFER_CACHE,
    );
    return PriceMath.sqrtPriceX64ToPrice(
      poolData.sqrtPrice,
      mints.get(poolData.tokenMintA.toBase58()).decimals,
      mints.get(poolData.tokenMintB.toBase58()).decimals
    );
  };

  let poolDataPromise = fetcher.getPool(ORCA_USDC_64_PUBKEY);
</script>

<h1>get ORCA/USDC(64) with AccountFetcher</h1>

{#await poolDataPromise}
  loading...
  <ul>
    <li>RPC: {$rpcConnection.rpcEndpoint}</li>
    <li>Pubkey: {ORCA_USDC_64_PUBKEY}</li>
  </ul>
{:then poolData}
  <ul>
    <li>liquidity: {poolData.liquidity}</li>
    <li>tickCurrentIndex: {poolData.tickCurrentIndex}</li>
    <li>sqrtPrice: {poolData.sqrtPrice}</li>
    <li>
      price: {#await getPrice(poolData)}loading...{:then price}{price}{/await}
    </li>
  </ul>
{/await}
