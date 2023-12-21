import { PublicKey } from "@solana/web3.js";

export const SOL_USDC_8_PUBKEY = new PublicKey("7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm");
export const SOL_USDC_64_PUBKEY = new PublicKey("HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ");
export const ORCA_USDC_64_PUBKEY = new PublicKey("5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF");

export const WELL_KNOWN_PUBLIC_RPC_ENDPOINTS: {name: string, endpoint: string, prefer?: boolean}[] = [
  { name: "Mainnet HELIUS", endpoint: "https://rpc-proxy.yugure-crypto.workers.dev", prefer: true },
  { name: "Mainnet Solana Public", endpoint: "https://api.mainnet-beta.solana.com" },
];
