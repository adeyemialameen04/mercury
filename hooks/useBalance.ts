import { useQuery } from "react-query";
import { getAccountBalance } from "~/queries/balance";
import { AccountBalance } from "~/types/balance";

export function useBalance(address: string | undefined) {
	return useQuery<AccountBalance | null>(
		[`balance-${address}`],
		() => (address ? getAccountBalance(address) : null),
		{
			enabled: !!address,
		},
	);
}
