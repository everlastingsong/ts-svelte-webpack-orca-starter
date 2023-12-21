<script lang="ts">
  import { Connection, Keypair, Transaction } from "@solana/web3.js";
  import {
    buildWhirlpoolClient,
    ORCA_WHIRLPOOL_PROGRAM_ID,
    WhirlpoolContext,
    Whirlpool,
    PriceMath,
    swapQuoteByInputToken,
  } from "@orca-so/whirlpools-sdk";
  import { Percentage, Wallet } from "@orca-so/common-sdk";
  import Decimal from "decimal.js";
  import BN from "bn.js";
  import { AdapterWallet } from "../../lib/adapter-wallet";
  import { rpcConnection } from "../../stores/index";
  import { SOL_USDC_64_PUBKEY } from "../../lib/constants";
  import { WalletAdapter, SignerWalletAdapter } from "@solana/wallet-adapter-base";
  import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

  let adapter: WalletAdapter|undefined = undefined;
  let message = "";
  const log = (msg: string) => { message = message + `<br>${msg}`; }

  async function connectPhantom() {
    const phantom = new PhantomWalletAdapter();
    await connect(phantom);
  }

  async function connect(newAdapter: WalletAdapter) {
    await newAdapter.connect();
    if (!newAdapter.connected) return;
    adapter = newAdapter;
  }

  async function disconnect() {
    await adapter.disconnect();
    adapter = undefined;
  }

  async function swap() {
    log("swap...");
    const wallet = new AdapterWallet(adapter as SignerWalletAdapter) as Wallet;
    const ctx = WhirlpoolContext.from($rpcConnection, wallet, ORCA_WHIRLPOOL_PROGRAM_ID);
    const client = buildWhirlpoolClient(ctx);

    log("get pool...");
    const pool = await client.getPool(SOL_USDC_64_PUBKEY);
    log("get quote...");
    const quote = await swapQuoteByInputToken(
      pool,
      pool.getTokenAInfo().mint,
      new BN(100_000), // lamports
      Percentage.fromFraction(1, 100), // 1%
      ORCA_WHIRLPOOL_PROGRAM_ID,
      ctx.fetcher,
    );

    log("build tx...");
    const tx = await pool.swap(quote);

    // Public RPC doesn't support Websocket...
    // const signature = await tx.buildAndExecute();

    // simple send
    const payload = await tx.build();
    log("send tx...");
    const signature = await adapter.sendTransaction(payload.transaction, $rpcConnection, {signers: payload.signers});
    log("signature: " + signature);
  }

</script>

<h1>swap SOL for USDC with WalletAdapter</h1>

{#if !adapter}
  <div>🚨 You should use burner wallet!! 🚨</div><br>
  <button on:click={connectPhantom}>Connect Phantom</button>
{:else}
  <div>pubkey: {adapter.publicKey.toBase58()}</div><br>
  <button on:click={disconnect}>Disconnect wallet</button>
  <button on:click={swap}>Swap 0.0001 SOL for USDC</button>
{/if}

<div>{@html message}</div>
