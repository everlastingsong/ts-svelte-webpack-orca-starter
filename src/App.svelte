<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes } from "./router";
</script>

<main>
  <h1 style="margin: 0em;"><a href="/#/">🏠</a> ts-svelte-webpack-orca-starter </h1>
  <hr />
  <Router {routes} />
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