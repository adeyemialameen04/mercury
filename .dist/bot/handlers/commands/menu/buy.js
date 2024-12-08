import { makeContractCall, broadcastTransaction, FungibleConditionCode, makeStandardSTXPostCondition, AnchorMode, contractPrincipalCV, uintCV, } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
const contractAddress = "SP3YY9K5QF54W0KTHKNA3SEPMR1B3GTB75BBPJWH0";
const contractName = "rocket-van-stxcity-dex";
const tokenContract = "rocket-van-stxcity";
const tokenTrait = "SP3YY9K5QF54W0KTHKNA3SEPMR1B3GTB75BBPJWH0-rocket-van-stxcity";
export async function stxCitybuy(senderKey, stxAmount, network = new StacksMainnet()) {
    // Add an optional post condition
    // See below for details on constructing post conditions
    const postConditionAddress = contractAddress;
    const postConditionCode = FungibleConditionCode.GreaterEqual;
    const postConditionAmount = stxAmount / 2; // fix slippage later
    const postConditions = [
        makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    ];
    const txOptions = {
        contractAddress,
        contractName,
        functionName: "buy",
        functionArgs: [
            contractPrincipalCV(contractAddress, tokenContract),
            uintCV(stxAmount),
        ],
        senderKey: "b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01",
        validateWithAbi: true,
        network,
        postConditions,
        anchorMode: AnchorMode.Any,
    };
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse.txid;
}
