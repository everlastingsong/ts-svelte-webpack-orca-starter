<script lang="ts">
import { getWhirlpoolList, POOL_SORT_BY_BASE_QUOTE_TICKSPACING } from "../../lib/orcaapi";
</script>
    
<h1>Whirlpool List</h1>

{#await getWhirlpoolList(POOL_SORT_BY_BASE_QUOTE_TICKSPACING)}
  loading...
{:then poolList}
  <table>
    <tr>
      <th>name</th>
      <th>base</th>
      <th>quote</th>
      <th>volume</th>
      <th>address</th>
    </tr>
    {#each poolList as pool}
    <tr>
      <td>{pool.symbolA}/{pool.symbolB}({pool.tickSpacing})</td>
      <td>{pool.symbolBase}</td>
      <td>{pool.symbolQuote}</td>
      <td>{pool.usdVolumeDay}</td>
      <td>{pool.address}</td>
    </tr>
    {/each}
  </table>
{/await}