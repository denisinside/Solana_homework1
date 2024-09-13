import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

async function main() {
    const suppliedToPubkey = process.argv[2] || null;
    const LAMPORTS_TO_SEND = Number.parseFloat(process.argv[3]) * LAMPORTS_PER_SOL || Math.round(Math.random()*1000000);

    if (!suppliedToPubkey) {
        console.log(`Please provide a public key to send to`);
        process.exit(1);
    }

    const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
    console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

    const toPubkey = new PublicKey(suppliedToPubkey);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    console.log(
        `✅ Loaded our own keypair, the destination public key, and connected to Solana`,
    );

    const transaction = new Transaction();


    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports: LAMPORTS_TO_SEND,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
        senderKeypair,
    ]);

    console.log(
        `💸 Finished! Sent ${LAMPORTS_TO_SEND} lamports (${LAMPORTS_TO_SEND/LAMPORTS_PER_SOL}) to the address ${toPubkey}. `,
    );
    console.log(`Transaction signature is ${signature}!`);
    console.log(`Transaction on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
}

main().catch(console.error);