import axios from "axios";
import { API_BASE_URL } from "~/lib/constants";
import { WalletData } from "~/types/wallet";

export const swapTokenVelar = async (
	swapOptions: any,
	walletData: WalletData,
) => {
	try {
		console.log("called");
		const res = await axios.post(`${API_BASE_URL}swap`, {
			swapOptions: {
				...swapOptions,
			},
			privateKey: walletData.stxPrivateKey,
			address: walletData.address,
		});

		return res;
	} catch (err) {
		console.log(err);
	}
};
