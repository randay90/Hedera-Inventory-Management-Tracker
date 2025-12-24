const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
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

    // Create new keys for the new account
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create new account
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("\nNew account ID: " + newAccountId);
    console.log("Private key: " + newAccountPrivateKey);
    console.log("Public key: " + newAccountPublicKey);

    // Get the new account's balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("New account balance: " + accountBalance.hbars.toTinybars() + " tinybars.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
