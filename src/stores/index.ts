import { Connection } from "@solana/web3.js";
import { writable } from "svelte/store";

export const rpcConnection = writable(undefined as Connection);