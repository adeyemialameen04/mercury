import {
	API_BASE_URL,
	AUTHORIZATION_HEADER,
	HIRO_PLATFORM_API_BASE_URL,
	HIRO_PLATFORM_API_KEY,
} from "~/lib/constants";
import axios from "axios";
import { v4 as uuidV4 } from "uuid";

export const createChainhook = async (txID: string, walletAddr: string) => {
	const url = `${HIRO_PLATFORM_API_BASE_URL}v1/ext/${HIRO_PLATFORM_API_KEY}/chainhooks`;
	const uuid = uuidV4();

	try {
		const { data } = await axios.post(url, {
			name: `${walletAddr} | ${txID}`,
			uuid: uuid,
			chain: "stacks",
			version: 1,
			networks: {
				mainnet: {
					if_this: {
						scope: "txid",
						equals: txID,
					},
					end_block: null,
					then_that: {
						http_post: {
							url: `${API_BASE_URL}api/track`,
							authorization_header: AUTHORIZATION_HEADER,
						},
					},
					start_block: 428371,
					decode_clarity_values: true,
					expire_after_occurrence: null,
				},
			},
		});

		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Error response:", error.response?.data);
		}
	}
};
export const deleteChainhook = async (chainhookUuid: string) => {
	try {
		const url = `${HIRO_PLATFORM_API_BASE_URL}v1/ext/${HIRO_PLATFORM_API_KEY}/chainhooks/${chainhookUuid}`;
		const { data } = await axios.delete(url);

		return data;
	} catch (err) {
		console.error(err);
	}
};
