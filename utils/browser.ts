import { EXPLORER_BASE_URL } from "~/lib/constants";
import { openBrowserAsync } from "expo-web-browser";

export const _handleOpenTxInExplorer = async (txID: string) => {
	let result = await openBrowserAsync(
		`${EXPLORER_BASE_URL}txid/${txID}?chain=mainnet`,
	);
	console.log(result);
};

export const _handleOpenAddressInExplorer = async (address: string) => {
	let result = await openBrowserAsync(
		`${EXPLORER_BASE_URL}address/${address}?chain=mainnet`,
	);
	console.log(result);
};
