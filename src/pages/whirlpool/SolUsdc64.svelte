<script lang="ts">
  import { Connection, Keypair } from "@solana/web3.js";
  import {
    buildWhirlpoolClient,
    ORCA_WHIRLPOOL_PROGRAM_ID,
    WhirlpoolContext,
    Whirlpool,
    PriceMath,
  } from "@orca-so/whirlpools-sdk";
  import Decimal from "decimal.js";
  import { KeypairWallet } from "../../lib/keypair-wallet";
  import { RPC_ENDPOINT_URL, SOL_USDC_64_PUBKEY } from "../../lib/constants";

  const connection = new Connection(RPC_ENDPOINT_URL, "confirmed");
  const wallet = new KeypairWallet(Keypair.generate());

  const ctx = WhirlpoolContext.from(
    connection,
    wallet,
    ORCA_WHIRLPOOL_PROGRAM_ID
  );
  const client = buildWhirlpoolClient(ctx);

  const getPrice = (pool: Whirlpool): Decimal => {
    return PriceMath.sqrtPriceX64ToPrice(
      pool.getData().sqrtPrice,
      pool.getTokenAInfo().decimals,
      pool.getTokenBInfo().decimals
    );
  };

  let poolPromise = client.getPool(SOL_USDC_64_PUBKEY);
</script>

<h1>get SOL/USDC(64) with WhirlpoolClient</h1>

{#await poolPromise}
  loading...
  <ul>
    <li>RPC: {RPC_ENDPOINT_URL}</li>
    <li>Pubkey: {SOL_USDC_64_PUBKEY}</li>
  </ul>
{:then pool}
  <ul>
    <li>liquidity: {pool.getData().liquidity}</li>
    <li>tickCurrentIndex: {pool.getData().tickCurrentIndex}</li>
    <li>sqrtPrice: {pool.getData().sqrtPrice}</li>
    <li>price: {getPrice(pool)}</li>
  </ul>
{/await}
