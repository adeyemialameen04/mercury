import axios from "axios";

export const getAccountBalance = async (stxAddr: string) => {
	try {
		const { data } = await axios.get(
			`https://api.hiro.so/extended/v1/address/${stxAddr}/balances`,
		);
		return data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
