import { uintCV, fetchCallReadOnlyFunction } from "@stacks/transactions";

export const getBuyableTokens = async (
	dexContract: string[],
	stxAddr: string,
	amount: number,
) => {
	const txOptions = {
		contractAddress: dexContract[0],
		contractName: dexContract[1],
		functionName: "get-buyable-tokens",
		functionArgs: [uintCV(amount)],
		senderAddress: stxAddr,
	};

	try {
		const res = await fetchCallReadOnlyFunction(txOptions);

		return res;
	} catch (err) {
		console.error(err);
	}
};

export const getSellableTokens = async (
	dexContract: string[],
	stxAddr: string,
	amount: number,
) => {
	console.log(amount);
	const txOptions = {
		contractAddress: dexContract[0],
		contractName: dexContract[1],
		functionName: "get-sellable-stx",
		functionArgs: [uintCV(amount)],
		senderAddress: stxAddr,
	};
	console.log(txOptions);

	try {
		console.log(1);
		const res = await fetchCallReadOnlyFunction(txOptions);
		console.log(2);
		console.log(res);

		return res;
	} catch (err) {
		console.error(err);
	}
};
