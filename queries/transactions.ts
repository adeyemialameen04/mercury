import axios from "axios";
import { HIRO_API_BASE_URL } from "~/lib/constants";
import { AddressTransactionsV2ListResponse } from "~/types/transactions";

export const getRecentTransactions = async (
	stxAddr: string,
): Promise<AddressTransactionsV2ListResponse> => {
	try {
		const url = `${HIRO_API_BASE_URL}extended/v1/address/${stxAddr}/transactions_with_transfers?limit=50&offset=0`;
		const { data } = await axios.get<AddressTransactionsV2ListResponse>(url);
		return data;
	} catch (err) {
		throw new Error(
			err instanceof Error ? err.message : "Failed to fetch transactions",
		);
	}
};

export const getMempoolTransactions = async (stxAddr: string) => {
	try {
		const url = `${HIRO_API_BASE_URL}extended/v1/tx/mempool?sender_address=${stxAddr}&order_by=fee&order=asc&limit=20&offset=0&unanchored=true`;
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		throw new Error(
			err instanceof Error ? err.message : "Failed to fetch transactions",
		);
	}
};
