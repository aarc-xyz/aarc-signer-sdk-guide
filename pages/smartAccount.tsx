import { useEffect, useState, useContext } from "react";
import { AarcEthersSigner } from "@aarc-xyz/ethers-v6-signer";
import {BiconomySmartAccountV2, createSmartAccountClient} from "@biconomy/account";
import { AarcSignerContext } from "@/pages/aarcSigner";
import { BICONOMY_PAYMASTER_API_KEY, BICONOMY_BUNDLE_API, CHAIN_ID } from "@/constants";


const handleCreateSmartWallet = async (signer: AarcEthersSigner) => {

    if (!BICONOMY_BUNDLE_API || !BICONOMY_PAYMASTER_API_KEY) {
        throw new Error('Missing required environment variables');
    }

    const smartAccountClient = await createSmartAccountClient({
        signer: signer,
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${CHAIN_ID}/${BICONOMY_BUNDLE_API}`,
        biconomyPaymasterApiKey: BICONOMY_PAYMASTER_API_KEY
    })

    return smartAccountClient;
}

export default function SmartAccount() {
    const [sessionKey, setSessionKey] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null);

    const [receiverAddress, setReceiverAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const [fundAmount, setFundAmount] = useState<string>('');

    useEffect(() => {
        const sessionKey = localStorage.getItem('sessionKey');
        const walletAddress = localStorage.getItem('walletAddress');
        if (sessionKey || walletAddress) {
            setSessionKey(sessionKey);
            setWalletAddress(walletAddress);
        }
    }, [])

    const signer = useContext(AarcSignerContext);

    let client: BiconomySmartAccountV2;
    const handleSubmit = async () => {
        if (sessionKey && walletAddress && signer) {
            client = await handleCreateSmartWallet(signer);
            const address = await client.getAccountAddress();
            console.log(`Smart account address: ${address}`)
            setSmartWalletAddress(address);
            alert(`Smart account address: ${address}`)
        } else {
            if (!sessionKey) console.log('Session key not found');
            if (!walletAddress) console.log('Wallet address not found');
            if (!signer) console.log('Signer not found');
        }
    }

    const handleTransfer = async () => {
       if (client) {
           const txn = await client.sendTransaction({
                to: receiverAddress,
                value: amount
           })
           console.log("Transaction ", txn);

           const receipt = await txn.wait();
           console.log("Transaction receipt ", receipt);
           alert("Transaction successful")
       } else {
           console.log('Client not found');
       }
    }

    const fundAccount = async () => {
        if (signer) {
            const tx = await signer.sendTransaction({
                to: smartWalletAddress,
                value: fundAmount
            })

            console.log("Transaction ", tx);
            const receipt = await tx.wait();
            console.log("Transaction receipt ", receipt);
            alert("Funding Transaction successful")
        } else {
            console.log('Signer not found');
        }
    }

    return (
        <div style={{margin: "10px"}}>
            {!smartWalletAddress && <button onClick={handleSubmit}>
            Create Smart Wallet
            </button>}

            {smartWalletAddress && <p>Smart wallet created with address: {smartWalletAddress}</p>}

            { smartWalletAddress && <div style={{margin: "10px"}}><h2> Send Transaction Through Smart Wallet</h2>
                <input
                    style={{margin: "5px", color: "black"}}
                    type = "text"
                    placeholder = "Receiver Address"
                    value = {receiverAddress}
                    onChange = {(e) => setReceiverAddress(e.target.value)}
                />
                <input
                    style={{margin: "5px", color: "black"}}
                    type = "text"
                    placeholder = "Amount"
                    value = {amount}
                    onChange = {(e) => setAmount(e.target.value)}
                />
                <button onClick={handleTransfer}> Transfer </button>
            </div>}

            { smartWalletAddress && <div style={{margin: "10px"}}>
                <h2> Fund Smart Account</h2>
                <input
                    style={{margin: "5px", color: "black"}}
                    type = "text"
                    placeholder = "Fund Amount"
                    value = {fundAmount}
                    onChange = {(e) => setFundAmount(e.target.value)}
                />
                <button onClick={fundAccount}> Fund Smart Wallet </button>
            </div>}
        </div>
    )
}
