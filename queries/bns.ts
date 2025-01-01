import axios from "axios";
import { HIRO_API_BASE_URL } from "~/lib/constants";
import { BnsNamesOwnByAddressResponse } from "~/types/bns";

export const getPrimaryBnsName = async (stxAddr: string) => {
	const { data: bnsNames } = await axios.get<BnsNamesOwnByAddressResponse>(
		`${HIRO_API_BASE_URL}v1/addresses/stacks/${stxAddr}`,
	);
	const primaryBns = bnsNames.names.length > 0 ? bnsNames.names[0] : null;

	return primaryBns;
};
