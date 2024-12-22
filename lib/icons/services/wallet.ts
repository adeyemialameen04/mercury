import {
	makeSTXTokenTransfer,
	broadcastTransaction,
} from "@stacks/transactions";
import { generateSecretKey, generateWallet } from "@stacks/wallet-sdk";
import { WalletData } from "~/types/wallet";

export const generateNewWallet = async (password: string, network: string) => {
	const mnemonic = generateSecretKey();

	const wallet = await generateWallet({
		secretKey: mnemonic,
		password: password,
	});

	return { wallet, mnemonic };
};

export const transferStx = async (
	walletData: WalletData,
	receiverAddr: string,
	amount: number,
	memo?: string,
	fee?: string,
) => {
	const txOptions = {
		recipient: receiverAddr,
		amount: amount * 10 ** 6,
		senderKey: walletData.stxPrivateKey,
		network: "mainnet" as const,
		memo,
	};
	try {
		const tx = await makeSTXTokenTransfer(txOptions);
		const response = await broadcastTransaction({
			transaction: tx,
			network: "mainnet",
		});

		return response;
	} catch (err) {
		console.error(err);
	}
};
