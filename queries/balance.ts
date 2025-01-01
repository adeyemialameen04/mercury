import axios from "axios";
import { HIRO_API_BASE_URL } from "~/lib/constants";
import { getPrimaryBnsName } from "./bns";

export const getAccountBalance = async (stxAddr: string) => {
	try {
		const { data } = await axios.get(
			`${HIRO_API_BASE_URL}extended/v1/address/${stxAddr}/balances`,
		);
		const primaryBns = getPrimaryBnsName(stxAddr);
		return {
			...data,
			bns: primaryBns,
		};
	} catch (err) {
		console.error(err);
		throw err;
	}
};
