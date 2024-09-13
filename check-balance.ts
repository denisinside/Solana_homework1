import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {getDomainKey, NameRegistryState} from "@bonfida/spl-name-service";

async function main() {
    // DiqcHC7956Tus3EAcF8HbDZV7FxqiDEDRASAjJmSXFm6
    const suppliedPublicKey = process.argv[2];
    if (!suppliedPublicKey) {
        throw new Error("Provide a public key or domain to check the balance of!");
    }
    try {
        let publicKey: PublicKey;
        if (suppliedPublicKey.endsWith('.sol')) {
            publicKey = await domainToPublicKey(suppliedPublicKey);
        } else {
            publicKey = new PublicKey(suppliedPublicKey);
        }

        const devnetBalance = await getBalance(publicKey, "https://api.devnet.solana.com")
        const testnetBalance = await getBalance(publicKey, "https://api.testnet.solana.com")
        const mainnetBalance = await getBalance(publicKey, "https://api.mainnet-beta.solana.com")

        console.log(
            `✅ Finished! The balance for the wallet at address ${suppliedPublicKey}:
        #Devnet: ${devnetBalance};
        #Testnet: ${testnetBalance};
        #Mainnet: ${mainnetBalance};`,
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("An unknown error occurred :-(");
        }
    }
}

async function getBalance(publicKey: PublicKey, endpoint: string) {
    const connection = new Connection(endpoint, "confirmed");
    const balanceInLamports = await connection.getBalance(publicKey);
    return balanceInLamports / LAMPORTS_PER_SOL;
}

async function domainToPublicKey(domain: string) {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const {pubkey} = await getDomainKey(domain);
    const {registry} = await NameRegistryState.retrieve(connection, pubkey);
    if (!registry.owner) {
        throw new Error(`Could not resolve ${domain} to a public key :-(`);
    }
    return registry.owner;
}

main().catch(console.error);