import { HIRO_API_BASE_URL, HIRO_MAINNET_API_URL } from "~/lib/constants";
import { openBrowserAsync } from "expo-web-browser";

export const _handleOpenTxInExplorer = async (txID: string) => {
	let result = await openBrowserAsync(
		`${HIRO_API_BASE_URL}txid/${txID}?chain=mainnet&api=${HIRO_MAINNET_API_URL}`,
	);
	console.log(result);
};
