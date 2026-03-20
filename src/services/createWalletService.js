const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar
} = require('@hiero-ledger/sdk')

function getClient() {
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_KEY;
    
    if (!operatorId || !operatorKey) {
        throw new Error(
        "Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY in environment variables"
        );
    }

    // Explicitly parse as ECDSA since your portal account is ECDSA type
    const parsedKey = PrivateKey.fromStringECDSA(operatorKey);
    
    return Client.forTestnet().setOperator(operatorId, parsedKey);
}

exports.createHederaWallet = async(initialBalance = 1) => {
    const client = getClient();
 
    // Generate a new ECDSA key pair (gives you the 0x EVM address)
    const privateKey = PrivateKey.generateECDSA();
    const publicKey = privateKey.publicKey;
    
    // Create the account on-chain
    const transaction = new AccountCreateTransaction()
        .setECDSAKeyWithAlias(publicKey)       // links the EVM alias address to the account
        .setInitialBalance(new Hbar(initialBalance));
    
    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const accountId = receipt.accountId.toString(); // e.g. "0.0.12345"
    
    return {
        accountId,
        evmAddress: `0x${publicKey.toEvmAddress()}`,
        privateKey: privateKey.toString(),     // ⚠️ Store encrypted — never log or expose this
        publicKey: publicKey.toString(),
    };
}

exports.getWalletBalance = async () => {
    const client = getClient();
    
    const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
    
    return balance.hbars.toString();
}