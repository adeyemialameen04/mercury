import { TokenData } from "~/types/token";
import { WalletData } from "~/types/wallet";

import {
	broadcastTransaction,
	bufferCV,
	makeContractCall,
	PostConditionMode,
	principalCV,
	uintCV,
	someCV, // Add this import
	noneCV,
	SignedContractCallOptions,
	Pc, // Add this import
} from "@stacks/transactions";

export const send = async (
	params: {
		amount: string;
		receiverAddr: string;
		fee: string;
		memmo: string;
	},
	tokenData: TokenData,
	walletData: WalletData,
) => {
	let memoCV;
	if (params.memmo) {
		let memoBuffer = Buffer.from(params.memmo);
		if (memoBuffer.length > 34) {
			memoBuffer = memoBuffer.slice(0, 34);
		} else if (memoBuffer.length < 34) {
			const padding = Buffer.alloc(34 - memoBuffer.length);
			memoBuffer = Buffer.concat([memoBuffer, padding]);
		}
		memoCV = someCV(bufferCV(memoBuffer));
	} else {
		memoCV = noneCV();
	}

	const decimal = tokenData?.decimals ? tokenData.decimals : 6;
	const uintAmt = Number.parseFloat(params.amount) * 10 ** decimal;
	const contract = tokenData.contract.split(".");

	const txOptions: SignedContractCallOptions = {
		contractAddress: contract[0],
		contractName: contract[1],
		functionName: "transfer",
		postConditions: [
			Pc.principal(walletData?.address as string) // The sender
				.willSendEq(uintAmt) // The exact amount they will send
				.ft(`${contract[0]}.${contract[1]}`, tokenData.ticker),
		],
		functionArgs: [
			uintCV(uintAmt.toString()),
			principalCV(walletData?.address as string),
			principalCV(params.receiverAddr),
			memoCV,
		],
		fee: Math.floor(Number.parseFloat(params.fee) * 1000000),
		senderKey: walletData?.stxPrivateKey as string,
		postConditionMode: PostConditionMode.Deny,
		validateWithAbi: true,
		network: "mainnet" as const,
	};
	console.log(txOptions);

	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				const tx = await makeContractCall(txOptions);
				const res = await broadcastTransaction({
					transaction: tx,
					network: "mainnet",
				});
				resolve(res);
			} catch (err) {
				console.error("Error details:", err);
				reject(err);
			}
		}, 0);
	});
};
