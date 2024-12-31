import { c32address } from "c32check";
import {
	FungiblePostCondition,
	NonFungiblePostCondition,
	PostCondition,
	StxPostCondition,
} from "@stacks/transactions";

// Enhanced enums with all possible condition types
enum ConditionType {
	STX = 0,
	Fungible = 1,
	NonFungible = 2, // Missing case
}

enum ConditionCode {
	Sent = 1,
	SentGTE = 3,
	SentLTE = 5,
	NotSent = 2, // Missing case
	NotSentGTE = 4, // Missing case
	NotSentLTE = 6, // Missing case
}

interface DecodedPostCondition {
	type: string;
	sender: string;
	recipient?: string;
	asset?: {
		contract: string;
		name: string;
		tokenId?: string;
	};
	amount: string;
	condition: string;
	isNegative?: boolean;
}

function decodeHash160ToStxAddress(hash160: string, version: number): string {
	try {
		return c32address(version, hash160);
	} catch (error) {
		console.error("Error decoding address:", error);
		return hash160;
	}
}

function formatAmount(amount: bigint, decimals: number = 6): string {
	if (amount === 0n) return "0";

	const amountStr = amount.toString();
	if (amountStr.length <= decimals) {
		return `0.${amountStr.padStart(decimals, "0")}`;
	}
	const integerPart = amountStr.slice(0, -decimals);
	const decimalPart = amountStr.slice(-decimals).replace(/0+$/, "");
	return `${integerPart}${decimalPart ? `.${decimalPart}` : ""}`;
}

function getConditionCodeString(code: number): string {
	switch (code) {
		case ConditionCode.Sent:
			return "exactly";
		case ConditionCode.SentGTE:
			return "greater than or equal to";
		case ConditionCode.SentLTE:
			return "less than or equal to";
		case ConditionCode.NotSent:
			return "not equal to";
		case ConditionCode.NotSentGTE:
			return "not greater than or equal to";
		case ConditionCode.NotSentLTE:
			return "not less than or equal to";
		default:
			return "unknown condition";
	}
}

function decodePostConditions(postConditions: any[]): DecodedPostCondition[] {
	if (!Array.isArray(postConditions)) {
		throw new Error("Post conditions must be an array");
	}

	return postConditions.map((pc) => {
		if (!pc.principal?.address?.hash160 || !pc.conditionType === undefined) {
			throw new Error("Invalid post condition format");
		}

		const baseAddress = decodeHash160ToStxAddress(
			pc.principal.address.hash160,
			pc.principal.address.version,
		);

		let decodedPC: DecodedPostCondition = {
			type: getConditionType(pc.conditionType),
			sender: baseAddress,
			amount: formatAmount(BigInt(pc.amount || 0)),
			condition: getConditionCodeString(pc.conditionCode),
			isNegative: isNegativeCondition(pc.conditionCode),
		};

		if (pc.principal.contractName) {
			decodedPC.sender = `${baseAddress}.${pc.principal.contractName.content}`;
		}

		if (pc.assetInfo) {
			const assetAddress = decodeHash160ToStxAddress(
				pc.assetInfo.address.hash160,
				pc.assetInfo.address.version,
			);
			decodedPC.asset = {
				contract: `${assetAddress}.${pc.assetInfo.contractName.content}`,
				name: pc.assetInfo.assetName.content,
				tokenId: pc.assetInfo.tokenId?.toString(),
			};
		}

		return decodedPC;
	});
}

function getConditionType(type: number): string {
	switch (type) {
		case ConditionType.STX:
			return "STX";
		case ConditionType.Fungible:
			return "Fungible Token";
		case ConditionType.NonFungible:
			return "Non-Fungible Token";
		default:
			return "Unknown Type";
	}
}

function isNegativeCondition(code: number): boolean {
	return [
		ConditionCode.NotSent,
		ConditionCode.NotSentGTE,
		ConditionCode.NotSentLTE,
	].includes(code);
}

function formatPostConditionsToString(postConditions: any[]): string {
	const decoded = decodePostConditions(postConditions);

	return decoded
		.map((pc) => {
			const negativePrefix = pc.isNegative ? "will not " : "will ";

			if (pc.asset) {
				if (pc.asset.tokenId) {
					return `${pc.sender} ${negativePrefix}transfer NFT #${pc.asset.tokenId} from contract ${pc.asset.contract}`;
				}
				return `${pc.sender} ${negativePrefix}transfer ${pc.condition} ${pc.amount} ${pc.asset.name} tokens from contract ${pc.asset.contract}`;
			} else {
				return `${pc.sender} ${negativePrefix}transfer ${pc.condition} ${pc.amount} STX`;
			}
		})
		.join("\n");
}

function formatAssetIdentifier(assetInfo: any): string {
	const address = decodeHash160ToStxAddress(
		assetInfo.address.hash160,
		assetInfo.address.version,
	);
	return `${address}.${assetInfo.contractName.content}::${assetInfo.assetName.content}`;
}

function getConditionString(code: number): string {
	switch (code) {
		case 1:
			return "eq";
		case 2:
			return "not_eq";
		case 3:
			return "gte";
		case 4:
			return "not_gte";
		case 5:
			return "lte";
		case 6:
			return "not_lte";
		default:
			return "eq";
	}
}

// Get structured decoded data
// const decodedData = decodePostConditions(postConditions);
// console.log("Structured format:", JSON.stringify(decodedData, null, 2));

export function transformPostConditions(
	postConditions: any[],
): PostCondition[] {
	if (!Array.isArray(postConditions)) {
		throw new Error("Post conditions must be an array");
	}

	return postConditions.map((pc) => {
		const baseAddress = decodeHash160ToStxAddress(
			pc.principal.address.hash160,
			pc.principal.address.version,
		);

		// Handle STX post conditions
		if (pc.conditionType === 0) {
			const stxCondition: StxPostCondition = {
				type: "stx-postcondition",
				address: baseAddress,
				condition: getConditionString(pc.conditionCode),
				amount: pc.amount.toString(),
			};
			return stxCondition;
		}

		// Handle Fungible Token post conditions
		else if (pc.conditionType === 1) {
			const ftCondition: FungiblePostCondition = {
				type: "ft-postcondition",
				address: baseAddress,
				condition: getConditionString(pc.conditionCode),
				amount: pc.amount.toString(),
				asset: formatAssetIdentifier(pc.assetInfo),
			};
			return ftCondition;
		}

		// Handle Non-Fungible Token post conditions
		else if (pc.conditionType === 2) {
			const nftCondition: NonFungiblePostCondition = {
				type: "nft-postcondition",
				address: baseAddress,
				condition: getConditionString(pc.conditionCode),
				asset: formatAssetIdentifier(pc.assetInfo),
				assetId: pc.assetInfo.tokenId?.toString() || "0",
			};
			return nftCondition;
		}

		throw new Error(`Unknown condition type: ${pc.conditionType}`);
	});
}

// Get human-readable string
// const readableFormat = formatPostConditionsToString(postConditions);
// console.log("Human readable format:\n\n\n", readableFormat);
//
// const transformed = transformPostConditions(postConditions);
// console.log(JSON.stringify(transformed, null, 2));

export {
	decodePostConditions,
	formatPostConditionsToString,
	DecodedPostCondition,
	ConditionType,
	ConditionCode,
	// transformed,
};
