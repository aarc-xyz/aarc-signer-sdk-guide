"use client";

import Wallets from "@aarc-xyz/wallet-auth";
import { Provider } from "@aarc-xyz/auth-widget";
import { AuthWidget } from "@/pages/authWidget";
import { CHAIN_ID, AARC_API_KEY } from "@/constants";

export default function App() {
    const config = {
        Wallet: function Wallet(props: any) {
            return <Wallets {...props} />
        },
        appearance: {
            logoUrl: "https://dashboard.aarc.xyz/assets/AuthScreenLogo-CNfNjJ82.svg",
            themeColor: "#2D2D2D",
            darkMode: false,
            textColor: "white",
        },
        callbacks: {
            onSuccess: (data: any) => {
                console.log('Authentication Successful', data);
                const walletAddress = data.data.wallet_address;
                localStorage.setItem('walletAddress', walletAddress);
            },
            onError: (data: any) => {
                console.log('Error', data);
            },
            onClose: (data: any) => {
                console.log('Close', data);
            },
            onOpen: (data: any) => {
                console.log('Open', data);
            }
        },
        authMethods: ['email', 'wallet'],
        socialAuth: ['google', 'farcaster'],
        aarc_api_key: AARC_API_KEY,
        chainId: CHAIN_ID,
    }

    return (
        <div>
            <Provider config={config}>
                <AuthWidget />
            </Provider>
        </div>
    )
}
