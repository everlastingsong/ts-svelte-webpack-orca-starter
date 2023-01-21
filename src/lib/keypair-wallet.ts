import { Keypair, Transaction, PublicKey } from "@solana/web3.js";

// reference: https://github.com/coral-xyz/anchor/blob/master/ts/packages/anchor/src/nodewallet.ts#L8
export class KeypairWallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
