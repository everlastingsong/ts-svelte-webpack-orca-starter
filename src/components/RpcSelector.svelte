<script lang="ts">
  import { Connection } from "@solana/web3.js";
  import { WELL_KNOWN_PUBLIC_RPC_ENDPOINTS } from "../lib/constants";
  import { rpcConnection } from "../stores/index";

  const prefer = WELL_KNOWN_PUBLIC_RPC_ENDPOINTS.filter((rpc) => !!rpc.prefer)[0].endpoint;
  let selected = prefer;
  onChange(); // init

  function onChange() {
    let newEndpoint = selected;
    if ( selected === "custom" ) {
      newEndpoint = window.prompt("Input your RPC Server");
    }
    rpcConnection.set(new Connection(newEndpoint, "confirmed"));
  }
</script>

<select bind:value={selected} on:change={onChange}>
  {#each WELL_KNOWN_PUBLIC_RPC_ENDPOINTS as rpc}
    <option value={rpc.endpoint}>{rpc.name} ({rpc.endpoint})</option>
  {/each}
  <option value="custom">Custom</option>
</select>
