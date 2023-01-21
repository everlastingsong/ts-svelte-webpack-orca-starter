import Home from "../pages/Home.svelte";
import SolUsdc64 from "../pages/whirlpool/SolUsdc64.svelte";
import OrcaUsdc64 from "../pages/whirlpool/OrcaUsdc64.svelte";
import WhirlpoolList from "../pages/whirlpool/WhirlpoolList.svelte";
import TokenList from "../pages/whirlpool/TokenList.svelte";
import MonitorSolUsdc8 from "../pages/whirlpool/MonitorSolUsdc8.svelte";

export const routes = {
  '/': Home,
  '/whirlpool/sol_usdc_64': SolUsdc64,
  '/whirlpool/orca_usdc_64': OrcaUsdc64,
  '/whirlpool/list': WhirlpoolList,
  '/whirlpool/tokens': TokenList,
  '/whirlpool/monitor': MonitorSolUsdc8,
}
