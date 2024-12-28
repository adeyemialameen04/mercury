import { AddressTransaction } from "~/types/transactions";

export function formatTransaction(transaction: AddressTransaction) {
	const { tx, ft_transfers, nft_transfers } = transaction;
	const { tx_type, contract_call, tx_id, block_height, block_time_iso } = tx;

	let formattedTx = {
		id: tx_id,
		type: tx_type,
		blockHeight: block_height,
		timestamp: new Date(block_time_iso).toLocaleString(),
		details: {} as any,
	};

	if (tx_type === "contract_call" && contract_call) {
		formattedTx.details = {
			contractId: contract_call.contract_id,
			functionName: contract_call.function_name,
			args: contract_call.function_args.reduce(
				(acc, arg) => {
					acc[arg.name] = arg.repr;
					return acc;
				},
				{} as Record<string, string>,
			),
		};
	}

	if (ft_transfers && ft_transfers.length > 0) {
		formattedTx.details.ftTransfers = ft_transfers.map((transfer) => ({
			amount: transfer.amount,
			asset: transfer.asset_identifier,
			from: transfer.sender,
			to: transfer.recipient,
		}));
	}

	if (nft_transfers && nft_transfers.length > 0) {
		formattedTx.details.nftTransfers = nft_transfers.map((transfer) => ({
			asset: transfer.asset_identifier,
			from: transfer.sender,
			to: transfer.recipient,
		}));
	}

	return formattedTx;
}

export const formatDateHeader = (date: Date): string => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return "Today";
	} else if (date.toDateString() === yesterday.toDateString()) {
		return "Yesterday";
	} else if (date.getFullYear() === today.getFullYear()) {
		return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
	} else {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
};

export const groupTransactionsByDate = (transactions) => {
	const grouped = transactions.reduce((groups, transaction) => {
		const date = new Date(transaction.tx.block_time_iso);
		const dateString = date.toISOString().split("T")[0];

		if (!groups[dateString]) {
			groups[dateString] = {
				date,
				transactions: [],
			};
		}

		groups[dateString].transactions.push(transaction);
		return groups;
	}, {});

	// Convert to array and sort by date (newest first)
	return Object.values(grouped).sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);
};
