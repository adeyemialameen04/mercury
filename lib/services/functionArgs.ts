interface TraitReference {
	address: {
		hash160: string;
		type: number;
		version: number;
	};
	contractName: {
		content: string;
		lengthPrefixBytes: number;
		maxLengthBytes: number;
		type: number;
	};
	type: number;
}

interface TransformedFunctionArg {
	type: number;
	value?: bigint;
	address?: {
		hash160: string;
		type: number;
		version: number;
	};
	contractName?: {
		content: string;
		lengthPrefixBytes: number;
		maxLengthBytes: number;
		type: number;
	};
}

function transformTraitReference(contract: any): TraitReference {
	return {
		address: {
			hash160: contract.address.hash160,
			type: 0,
			version: 22, // Standard version for mainnet
		},
		contractName: {
			content: contract.contractName.content,
			lengthPrefixBytes: 1,
			maxLengthBytes: 128,
			type: 2,
		},
		type: 6, // Type for trait reference
	};
}

export function transformFunctionArgs(
	swapOptions: any,
): TransformedFunctionArg[] {
	const transformedArgs: TransformedFunctionArg[] = [];

	// ID (uint128)
	transformedArgs.push({
		type: 1,
		value: BigInt(swapOptions.functionArgs[0]?.value || "21"),
	});

	// Token0 (trait reference)
	transformedArgs.push(transformTraitReference(swapOptions.functionArgs[1]));

	// Token1 (trait reference)
	transformedArgs.push(transformTraitReference(swapOptions.functionArgs[2]));

	// Token-in (trait reference)
	transformedArgs.push(transformTraitReference(swapOptions.functionArgs[3]));

	// Token-out (trait reference)
	transformedArgs.push(transformTraitReference(swapOptions.functionArgs[4]));

	// Share-fee-to (trait reference)
	transformedArgs.push(transformTraitReference(swapOptions.functionArgs[5]));

	// Amount in (uint128)
	transformedArgs.push({
		type: 1,
		value: BigInt(swapOptions.functionArgs[6]?.value || "0"),
	});

	// Amount out min (uint128)
	transformedArgs.push({
		type: 1,
		value: BigInt(swapOptions.functionArgs[7]?.value || "0"),
	});

	return transformedArgs;
}
