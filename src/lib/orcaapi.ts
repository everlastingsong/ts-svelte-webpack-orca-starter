import { PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";
import fetch from "node-fetch";
import moment from "moment";
import { PoolUtil } from "@orca-so/whirlpools-sdk";

const V1_WHIRLPOOL_LIST = "https://api.mainnet.orca.so/v1/whirlpool/list";
const V1_TOKEN_LIST = "https://api.mainnet.orca.so/v1/token/list";

export type WhirlpoolListEntry = {
  address: PublicKey,
  name: string,
  symbolA: string,
  symbolB: string,
  mintA: PublicKey,
  mintB: PublicKey,
  symbolQuote: string,
  symbolBase: string,
  mintQuote: PublicKey,
  mintBase: PublicKey,
  tickSpacing: number,
  price: Decimal,
  usdTVL: Decimal,
  usdVolumeDay: Decimal,
}

export type WhirlpoolListEntryComparator = (x: WhirlpoolListEntry, y: WhirlpoolListEntry) => number;
export const POOL_SORT_BY_SYMBOL_TICKSPACING = (x: WhirlpoolListEntry, y: WhirlpoolListEntry): number => {
  if ( x.symbolA < y.symbolA ) return -1;
  if ( x.symbolA > y.symbolA ) return +1;
  if ( x.symbolB < y.symbolB ) return -1;
  if ( x.symbolB > y.symbolB ) return +1;
  if ( x.tickSpacing < y.tickSpacing ) return -1;
  if ( x.tickSpacing > y.tickSpacing ) return +1;
  return 0;
}
export const POOL_SORT_BY_BASE_QUOTE_TICKSPACING = (x: WhirlpoolListEntry, y: WhirlpoolListEntry): number => {
  if ( x.symbolBase < y.symbolBase ) return -1;
  if ( x.symbolBase > y.symbolBase ) return +1;
  if ( x.symbolQuote < y.symbolQuote ) return -1;
  if ( x.symbolQuote > y.symbolQuote ) return +1;
  if ( x.tickSpacing < y.tickSpacing ) return -1;
  if ( x.tickSpacing > y.tickSpacing ) return +1;
  return 0;
}

export type TokenListComparator = (x: TokenListEntry, y: TokenListEntry) => number;
export const TOKEN_SORT_BY_SYMBOL = (x: TokenListEntry, y: TokenListEntry): number => {
  if ( x.symbol < y.symbol ) return -1;
  if ( x.symbol > y.symbol ) return +1;
  return 0;
}

export type TokenListEntry = {
  address: PublicKey,
  symbol: string,
  name: string,
  decimals: number,
  logoURI: string,
  coingeckoId: string,
  whitelisted: boolean,
  poolToken: boolean,
}


let _cachedWhirlpoolList: WhirlpoolListEntry[] = null;
let _cachedWhirlpoolListExpire: moment.Moment = null;
export async function getWhirlpoolList(
  sortBy: WhirlpoolListEntryComparator = POOL_SORT_BY_SYMBOL_TICKSPACING,
  forceRefresh: boolean = false,
): Promise<WhirlpoolListEntry[]> {
  const now = moment();
  if (_cachedWhirlpoolList === null || _cachedWhirlpoolListExpire.isBefore(now) || forceRefresh) {
    const response = await (await fetch(V1_WHIRLPOOL_LIST)).json();

    const list: WhirlpoolListEntry[] = [];
    response.whirlpools.forEach((p) => {
      const mintA = new PublicKey(p.tokenA.mint);
      const mintB = new PublicKey(p.tokenB.mint);
  
      const invert = PoolUtil.toBaseQuoteOrder(mintA, mintB)[0] !== mintA;
  
      list.push({
        address: new PublicKey(p.address),
        name: `${p.tokenA.symbol}/${p.tokenB.symbol}(${p.tickSpacing})`,
        symbolA: p.tokenA.symbol,
        symbolB: p.tokenB.symbol,
        mintA,
        mintB,
        symbolBase: invert ? p.tokenB.symbol : p.tokenA.symbol,
        symbolQuote: invert ? p.tokenA.symbol : p.tokenB.symbol,
        mintBase: invert ? mintB : mintA,
        mintQuote: invert ? mintA : mintB,
        tickSpacing: p.tickSpacing,
        price: new Decimal(p.price),
        usdTVL: new Decimal(p.tvl ?? 0),
        usdVolumeDay: new Decimal(p.volume?.day ?? 0),
      });
    });
  
    _cachedWhirlpoolListExpire = now.add("15", "m"); // 15 min
    _cachedWhirlpoolList = list;
  }

  const sorted = [..._cachedWhirlpoolList].sort(sortBy);
  return sorted;
}

let _cachedTokenList: TokenListEntry[] = null;
export async function getTokenList(
  forceRefresh: boolean = false,
): Promise<TokenListEntry[]> {
  if (_cachedTokenList === null || forceRefresh) {
    const response = await (await fetch(V1_TOKEN_LIST)).json();

    const list: TokenListEntry[] = [];
    response.tokens.forEach((t) => {
      list.push({
        address: new PublicKey(t.mint),
        symbol: t.symbol,
        name: t.name,
        decimals: t.decimals,
        logoURI: t.logoURI,
        coingeckoId: t.coingeckoId,
        whitelisted: t.whitelisted,
        poolToken: t.poolToken,
      });
    });

    _cachedTokenList = list.sort(TOKEN_SORT_BY_SYMBOL);
  }

  const a = [..._cachedTokenList];
  return a;
}

export async function getTokenMap(
  forceRefresh: boolean = false,
): Promise<Record<string, TokenListEntry>> {
  const list = await getTokenList(forceRefresh);
  const map: Record<string, TokenListEntry> = {};
  list.forEach((t) => map[t.address.toBase58()] = t);
  return map;
}
