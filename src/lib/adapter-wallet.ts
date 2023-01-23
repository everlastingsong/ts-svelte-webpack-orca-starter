import { Transaction, PublicKey } from "@solana/web3.js";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";

// reference: https://github.com/coral-xyz/anchor/blob/master/ts/packages/anchor/src/nodewallet.ts#L8
export class AdapterWallet {
  constructor(private adapter: SignerWalletAdapter) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    return await this.adapter.signTransaction(tx);
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return await this.adapter.signAllTransactions(txs);
  }

  get publicKey(): PublicKey {
    return this.adapter.publicKey;
  }
}
