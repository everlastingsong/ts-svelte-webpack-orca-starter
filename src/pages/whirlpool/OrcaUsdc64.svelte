<script lang="ts">
  import { Connection } from "@solana/web3.js";
  import {
    AccountFetcher,
    PriceMath,
    WhirlpoolData,
  } from "@orca-so/whirlpools-sdk";
  import Decimal from "decimal.js";
  import { RPC_ENDPOINT_URL, ORCA_USDC_64_PUBKEY } from "../../lib/constants";

  const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");
  const fetcher = new AccountFetcher(connection);

  const getPrice = async (poolData: WhirlpoolData): Promise<Decimal> => {
    const mints = await fetcher.listMintInfos(
      [poolData.tokenMintA, poolData.tokenMintB],
      false
    );
    return PriceMath.sqrtPriceX64ToPrice(
      poolData.sqrtPrice,
      mints[0].decimals,
      mints[1].decimals
    );
  };

  let poolDataPromise = fetcher.getPool(ORCA_USDC_64_PUBKEY);
</script>

<h1>get ORCA/USDC(64) with AccountFetcher</h1>

{#await poolDataPromise}
  loading...
  <ul>
    <li>RPC: {RPC_ENDPOINT_URL}</li>
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
