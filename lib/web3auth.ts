import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const clientId =
    "BBPm19FwYHXEyj9KHXi5cupu7cJVaptxIj69bcQu1N-7JZI6eI6gsbklsqMmQtoLibl1M4dKzMwCmAEzEZIB3Rw";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    rpcTarget: "https://api.devnet.solana.com",
    displayName: "Solana Devnet",
    blockExplorerUrl: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana",
    logo: "https://images.toruswallet.io/solana.svg",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
    config: { chainConfig: chainConfig },
});

export const web3AuthOptions = {
    // Get it from Web3Auth Dashboard
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
}

export const web3auth = new Web3Auth(web3AuthOptions);
