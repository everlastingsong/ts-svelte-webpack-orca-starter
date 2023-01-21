<script lang="ts">
  import { Connection } from "@solana/web3.js";
  import {
    ParsableWhirlpool,
    PriceMath,
    WhirlpoolData,
  } from "@orca-so/whirlpools-sdk";
  import { SOL_USDC_8_PUBKEY } from "../../lib/constants";
  import { getTokenMap, TokenListEntry } from "../../lib/orcaapi";
  import { rpcConnection } from "../../stores/index";
  import { onMount } from "svelte";
  import Decimal from "decimal.js";
  import moment from "moment";

  type PriceHistoryEntry = {
    timestamp: moment.Moment;
    price: Decimal;
  };

  let tokens: Record<string, TokenListEntry> = undefined;

  let updatedMoment: moment.Moment = undefined;
  let updatedSlot: number = undefined;
  let poolData: WhirlpoolData = undefined;
  let price: Decimal = undefined;
  let priceHistory: PriceHistoryEntry[] = [];

  const updatePriceHistory = (timestamp: moment.Moment, price: Decimal) => {
    priceHistory.unshift({ timestamp, price });
    while (priceHistory.length > 10) priceHistory.pop();
    priceHistory = priceHistory; // notify update to svelte
  };

  const updateCallback = async (accountInfo, context) => {
    if (!tokens) return;

    console.log("callback");

    updatedMoment = moment();
    updatedSlot = context.slot;

    // parse Whirlpool
    const data = ParsableWhirlpool.parse(accountInfo.data);
    poolData = data;

    // sqrtPrice to price
    price = PriceMath.sqrtPriceX64ToPrice(
      data.sqrtPrice,
      tokens[data.tokenMintA.toBase58()].decimals,
      tokens[data.tokenMintB.toBase58()].decimals
    );

    updatePriceHistory(updatedMoment, price);
  };

  onMount(() => {
    // get tokens
    (async () => {
      tokens = await getTokenMap();
    })();

    // subscribe
    console.log("subscribe on");
    const subscriptionId = $rpcConnection.onAccountChange(
      SOL_USDC_8_PUBKEY,
      updateCallback,
      "confirmed"
    );

    // initial fetch
    (async () => {
      const dataWithContext = await $rpcConnection.getAccountInfoAndContext(
        SOL_USDC_8_PUBKEY,
        "confirmed"
      );
      await updateCallback(dataWithContext.value, dataWithContext.context);
    })();

    // unsubscribe on unmount
    return () => {
      $rpcConnection.removeAccountChangeListener(subscriptionId).then(() => {
        console.log("subscribe off");
      });
    };
  });
</script>

<h1>monitor SOL/USDC(8) with onAccountChange</h1>

<h2>Public RPC servers don't support WebSocket from browsers...<br> so this page may not work well.</h2>

<h3>Realtime account info</h3>
<ul>
  <li>updatedMoment: {updatedMoment?.toString()}</li>
  <li>updatedSlot: {updatedSlot}</li>
  <li>liquidity: {poolData?.liquidity}</li>
  <li>tickCurrentIndex: {poolData?.tickCurrentIndex}</li>
  <li>sqrtPrice: {poolData?.sqrtPrice}</li>
  <li>price: {price?.toFixed(6)}</li>
</ul>

<h3>Recent prices</h3>
<table>
  <tr>
    <th>timestamp</th>
    <th>price</th>
  </tr>
  {#each priceHistory as history}
    <tr>
      <td>{history.timestamp.format("HH:mm:ss")}</td>
      <td>{history.price.toFixed(6)}</td>
    </tr>
  {/each}
</table>

<style>
  h2 {
    background-color: lightpink;
  }
</style>