<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes } from "./router";
  import RpcSelector from "./components/RpcSelector.svelte";
  import { rpcConnection } from "./stores";

  const repositoryURL = "https://github.com/everlastingsong/ts-svelte-webpack-orca-starter";
</script>

<main>
  <div style="text-align: right;"><RpcSelector /></div>
  <h1 style="margin: 0em;">
    <a href="#/">🏠</a> ts-svelte-webpack-orca-starter
  </h1>
  <span style="font-size: x-small">Repository : <a href={repositoryURL}>{repositoryURL}</a></span>
  <hr />
  {#key $rpcConnection} <!-- re-render if rpcConnection is changed -->
    <Router {routes} />
  {/key}
</main>

<style>
  main {
    text-align: left;
    padding: 0.2em 0.2em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
