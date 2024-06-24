import {useEffect, useState} from "react";
import {useAuthWidget, useWallet} from "@aarc-xyz/auth-widget";
import '@aarc-xyz/auth-widget/dist/style.css';
import Link from "next/link";
import {LogoutButton} from "@/pages/logoutButton";
import {AarcSigner} from "@/pages/aarcSigner";

export function AuthWidget() {
    const [sessionKey, setSessionKey] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const { openAuthWidget } = useAuthWidget();
    const sendTransaction = useWallet();

    useEffect(() => {
            console.log('Auth widget mounted');
            const sessionKey = localStorage.getItem('sessionKey');
            const walletAddress = localStorage.getItem('walletAddress');
            if (sessionKey) {
                setSessionKey(sessionKey)
                setWalletAddress(walletAddress);
            } else {
                openAuthWidget();
                setSessionKey(localStorage.getItem('sessionKey'));
                setWalletAddress(localStorage.getItem('walletAddress'));
            }
            return () => {
                console.log('Auth widget unmounted')
            }
        }
        , [])

    return (
        <>
            {sessionKey && <div>
                <AarcSigner/>
            </div>}
            <div>
                {sessionKey && <LogoutButton/>}
            </div>
        </>
    )
}