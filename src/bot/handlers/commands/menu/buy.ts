import {
  makeContractCall,
  FungibleConditionCode,
  makeContractSTXPostCondition,
  Pc,
  AnchorMode,
  PostConditionMode,
  contractPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import { broadcastTransaction } from "@stacks/transactions";

const contractAddress = "SP3YY9K5QF54W0KTHKNA3SEPMR1B3GTB75BBPJWH0";
const contractName = "rocket-van-stxcity-dex";
const tokenContract = "rocket-van-stxcity";

export async function buy(
  senderAddress: string,
  stxAmount: number
): Promise<any> {
  // Create post condition for STX transfer with 50% slippage protection
  const postConditionCode = FungibleConditionCode.GreaterEqual;
  const postConditionAmount = stxAmount / 2; // 50% slippage tolerance
  const postCondition = makeContractSTXPostCondition(
    contractAddress,
    contractName,
    postConditionCode,
    postConditionAmount
  );

  const transaction = await makeContractCall({
    contractAddress,
    contractName,
    functionName: "buy",
    functionArgs: [
      // Token trait reference
      contractPrincipalCV(contractAddress, tokenContract),
      uintCV(stxAmount),
    ],
    senderKey: privateKey,
    network: new StacksMainnet(),
    postConditions: [postCondition],
    postConditionMode: PostConditionMode.Deny,
  });

  return transaction;
}

export async function broadcastBuyTransaction(transaction: any) {
  try {
    const broadcastResponse = await broadcastTransaction(transaction);
    console.log("Transaction broadcast response:", broadcastResponse);
    return broadcastResponse;
  } catch (error) {
    console.error("Error broadcasting transaction:", error);
    throw error;
  }
}

const tx = await buy(mainnet, senderAddress, stxAmount);
const txId = await broadcastBuyTransaction(tx);
