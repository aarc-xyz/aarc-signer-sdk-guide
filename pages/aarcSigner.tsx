import {createContext, useEffect, useState} from "react";
import {AarcEthersSigner} from "@aarc-xyz/ethers-v6-signer";
import { AARC_API_KEY, CHAIN_ID, RPC_URL } from "@/constants";
import SmartAccount from "@/pages/smartAccount";
import Link from "next/link";

export const AarcSignerContext = createContext<AarcEthersSigner | null>(null);

export const AarcSigner = () => {
    const [sessionKey, setSessionKey] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        console.log('Aarc Signer Setup');
        const sessionKey = localStorage.getItem('sessionKey');
        const walletAddress = localStorage.getItem('walletAddress');

        setSessionKey(sessionKey);
        setWalletAddress(walletAddress);

    }, []);

    console.log('Session Key:', sessionKey);
    console.log('Wallet Address:', walletAddress);

    if (!sessionKey || !walletAddress) {
        console.log('Session Key or Wallet Address not found');
        return;
    }

    const signer = new AarcEthersSigner(RPC_URL, {
        wallet_address: walletAddress,
        sessionKey: sessionKey,
        chainId: CHAIN_ID,
        apiKeyId: AARC_API_KEY
        }
    );


    return (
        <AarcSignerContext.Provider value={signer}>
            <SmartAccount/>
        </AarcSignerContext.Provider>
    )
}