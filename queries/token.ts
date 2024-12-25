import axios from "axios";
import { HIRO_API_BASE_URL } from "~/lib/constants";

export async function getTokenMetadata(contractID: string) {
	try {
		const { data } = await axios.get(
			`${HIRO_API_BASE_URL}metadata/v1/ft/${contractID}`,
		);
		return data;
	} catch (err) {
		console.error(err);
	}
}
