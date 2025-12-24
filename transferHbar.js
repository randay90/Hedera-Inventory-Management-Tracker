const {
    Client,
    PrivateKey,
    TransferTransaction,
    AccountId,
    AccountBalanceQuery,
    Hbar
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    // Get operator keys from environment variables
    const operatorId = process.env.OPERATOR_ID;
    const operatorKey = process.env.OPERATOR_KEY;

    if (operatorId == null || operatorKey == null) {
        throw new Error("Environment variables OPERATOR_ID and OPERATOR_KEY are required.");
    }

    // Create client instance
    const client = Client.forTestnet();
    
    // Convert the operator key string to a PrivateKey object
    const privateKey = PrivateKey.fromStringED25519(operatorKey);
    
    client.setOperator(operatorId, privateKey);

    try {
        // The account ID where you want to send HBAR
        const receiverAccountId = AccountId.fromString("0.0.6398697"); // Replace with recipient's account ID
        
        // Set the amount to transfer
        const transferAmount = 10; // Amount in HBAR to transfer (reduced for testing)

        // Create a transaction to transfer HBAR
        const transferTx = new TransferTransaction()
            .addHbarTransfer(operatorId, new Hbar(-transferAmount)) // Sending HBAR
            .addHbarTransfer(receiverAccountId, new Hbar(transferAmount)) // Receiving HBAR
            .setTransactionMemo(`Transfer ${transferAmount} HBAR`); // Optional memo with amount
            
        // Submit the transaction to the Hedera network
        const txResponse = await transferTx.execute(client);

        // Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        // Get the transaction consensus status and ID
        const transactionStatus = receipt.status;
        const transactionId = txResponse.transactionId.toString();

        // Get account balances after transfer
        const senderBalance = await new AccountBalanceQuery()
            .setAccountId(operatorId)
            .execute(client);

        const receiverBalance = await new AccountBalanceQuery()
            .setAccountId(receiverAccountId)
            .execute(client);

        console.log("\n------------BLOCK CHAIN BROCKERS--------------------");
        console.log("Transfer Results:");
        console.log("- Status:", transactionStatus.toString());
        console.log("<-> Amount Transferred:", transferAmount, "HBAR");
        console.log("<- Sender Account ID:", operatorId);
        console.log("<- Sender Balance:", senderBalance.hbars.toString());
        console.log("-> Receiver Account ID:", receiverAccountId.toString());
        console.log("-> Receiver Balance:", receiverBalance.hbars.toString());
        console.log("- Transaction ID:", transactionId);
        console.log("- See it on HashScan:", `https://hashscan.io/testnet/tx/${transactionId}`);
        console.log("--------------Sending Money to the same account lol but I understand Now!!!------------------\n");

    } catch (error) {
        console.error("\nError during transfer:", error.message || error);
    } finally {
        // Always close the client
        client.close();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
