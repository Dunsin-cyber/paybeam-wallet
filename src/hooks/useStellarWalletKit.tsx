// hooks/useStellarWalletKit.tsx
'use client';

import { useCallback, useEffect, useState } from "react";
import {
  allowAllModules,
  FREIGHTER_ID,
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit";

const SELECTED_WALLET_ID = "selectedWalletId";

enum WalletNetwork {
  PUBLIC = "Public Global Stellar Network ; September 2015",
  TESTNET = "Test SDF Network ; September 2015",
}

const kit = new StellarWalletsKit({
  modules: allowAllModules(),
  network: WalletNetwork.TESTNET,
  selectedWalletId: typeof window !== 'undefined'
    ? localStorage.getItem(SELECTED_WALLET_ID) ?? FREIGHTER_ID
    : FREIGHTER_ID,
});

export function useWalletKit() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connectedWalletId, setConnectedWalletId] = useState<string | null>(null);

  const connect = useCallback(async () => {
    await kit.openModal({
      onWalletSelected: async (option) => {
        localStorage.setItem(SELECTED_WALLET_ID, option.id);
        kit.setWallet(option.id);
        const { address } = await kit.getAddress();
        setConnectedWalletId(option.id);
        setPublicKey(address);
        return option.id;
      },
    });
  }, []);

  const disconnect = useCallback(async () => {
    kit.disconnect();
    localStorage.removeItem(SELECTED_WALLET_ID);
    setConnectedWalletId(null);
    setPublicKey(null);
  }, []);

  const sign = useCallback(async (xdr: string) => {
    return await kit.signTransaction(xdr);
  }, []);

  useEffect(() => {
    // Load existing session
    const load = async () => {
      const id = localStorage.getItem(SELECTED_WALLET_ID);
      if (id) {
        kit.setWallet(id);
        const { address } = await kit.getAddress();
        setConnectedWalletId(id);
        setPublicKey(address);
      }
    };
    load();
  }, []);

  return {
    connect,
    disconnect,
    publicKey,
    connectedWalletId,
    signTransaction: sign,
  };
}
