import axios, { AxiosError } from "axios";
import {
	HIRO_API_BASE_URL,
	STX_CITY_API_BASE_URL,
	XVERSE_API_BASE_URL,
} from "~/lib/constants";

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

export const getTokens = async (coins: string[]) => {
	try {
		const { data } = await axios.post(`${XVERSE_API_BASE_URL}sip10/tokens`, {
			currency: "USD",
			coins: JSON.stringify(coins),
		});
		return data;
	} catch (err) {
		console.error(err);
	}
};

export async function getTokenMetadataFromSTXCity(contractID: string) {
	try {
		if (!contractID) {
			throw new Error("YOU MUST PASS CONTRACT ID");
		}
		console.log("starting to fetch");
		const url = `${STX_CITY_API_BASE_URL}searchTokens?token_contract=${contractID}`;
		const { data } = await axios.get(url);
		console.log(data, url, "hereee");
		return data;
	} catch (err) {
		if (err instanceof AxiosError) {
			console.error(err.name, err.code, err.response);
			console.log(JSON.stringify(err.toJSON(), null, 2));
		}
	}
}

export async function curveList() {
	try {
		const url = `https://stx.city/api/fetchFrontEnd/bondingData?page=1limit=10`;
		const { data } = await axios.get(url);
		console.log(data, url);
		return data;
	} catch (err) {
		if (err instanceof AxiosError) {
			console.error(err.name, err.code, err.response);
			console.log(JSON.stringify(err.toJSON(), null, 2));
		}
	}
}
