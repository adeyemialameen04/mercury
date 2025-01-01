import axios from "axios";
import { HIRO_API_BASE_URL } from "~/lib/constants";
import { BnsNamesOwnByAddressResponse } from "~/types/bns";

export const getAccountBalance = async (stxAddr: string) => {
	try {
		const { data } = await axios.get(
			`${HIRO_API_BASE_URL}extended/v1/address/${stxAddr}/balances`,
		);
		const { data: bnsNames } = await axios.get<BnsNamesOwnByAddressResponse>(
			`${HIRO_API_BASE_URL}v1/addresses/stacks/${stxAddr}`,
		);
		return {
			...data,
			bns: bnsNames?.names.length > 0 ? bnsNames.names[0] : null,
		};
	} catch (err) {
		console.error(err);
		throw err;
	}
};
