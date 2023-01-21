<script lang="ts">
import { getTokenList } from "../../lib/orcaapi";
</script>
    
<h1>Token List</h1>

{#await getTokenList()}
  loading...
{:then tokenList}
  <table>
    <tr>
      <th>symbol</th>
      <th>name</th>
      <th>decimals</th>
      <th>address</th>
    </tr>
    {#each tokenList as token}
    <tr>
      <td>{token.symbol}</td>
      <td>{token.name}</td>
      <td>{token.decimals}</td>
      <td>{token.address}</td>
    </tr>
    {/each}
  </table>
{/await}