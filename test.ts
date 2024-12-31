type WireFormat = {
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
};

type ReadableFormat = {
	type: string;
	value:
		| string
		| {
				hash160: string;
				type: number;
				version: number;
		  }
		| {
				content: string;
				lengthPrefixBytes: number;
				maxLengthBytes: number;
				type: number;
		  };
};

function convertClarityType(wireArgs: WireFormat[]): ReadableFormat[] {
	// Map of wire format type numbers to readable type names
	const typeMap: { [key: number]: string } = {
		1: "uint",
		2: "int",
		3: "bool",
		4: "principal",
		5: "none",
		6: "contract-principal",
		7: "response",
		8: "optional",
		9: "tuple",
		10: "buffer",
		11: "list",
	};

	return wireArgs.map((arg) => {
		const readableType = typeMap[arg.type] || `unknown-type-${arg.type}`;

		// Handle different types of values
		if (arg.type === 1 || arg.type === 2) {
			// Convert BigInt to string
			return {
				type: readableType,
				value: arg.value?.toString() || "0",
			};
		} else if (arg.type === 6) {
			// Handle contract-principal type
			return {
				type: readableType,
				value: {
					...arg.address!,
					contractName: arg.contractName?.content,
				},
			};
		}
		// Add more type conversions as needed

		// Default case - just convert the value to string if it exists
		return {
			type: readableType,
			value: arg.value?.toString() || "",
		};
	});
}

// Example usage
const wireFormatExample = [
	{
		type: 1,
		value: 21n,
	},
	{
		type: 6,
		address: {
			hash160: "7c5f674a8fd08efa61dd9b11121e046dd2c89273",
			type: 0,
			version: 22,
		},
		contractName: {
			content: "velar-token",
			lengthPrefixBytes: 1,
			maxLengthBytes: 128,
			type: 2,
		},
	},
];

const converted = convertClarityType(wireFormatExample);
console.log(JSON.stringify(converted, null, 2));
