import { useQuery } from "react-query";
import React from "react";
import { getAccountBalance } from "~/queries/balance";
import { getTokens } from "~/queries/token";
import { AccountBalance } from "~/types/balance";
import { WalletData } from "~/types/wallet";

export function useWalletBalance(walletData: WalletData | null) {
	// Get wallet balance
	const {
		data: balanceData,
		isLoading: isBalanceLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery<AccountBalance | null>(
		[`balance-${walletData?.address}`],
		() => (walletData?.address ? getAccountBalance(walletData.address) : null),
		{
			enabled: !!walletData?.address,
		},
	);

	// Extract token IDs from balance data
	const tokenIDS = React.useMemo(() => {
		if (!balanceData?.fungible_tokens) return [];
		return Object.keys(balanceData.fungible_tokens).map(
			(key) => key.split("::")[0],
		);
	}, [balanceData]);

	// Get token details
	const { isLoading: isTokenLoading, data: tokensData } = useQuery(
		[`tokens-${walletData?.address}`, tokenIDS],
		() => getTokens(tokenIDS),
		{
			enabled: !!walletData?.address && tokenIDS.length > 0,
		},
	);

	// Merge token data with balances
	const mergedTokens = React.useMemo(() => {
		if (!tokensData || !balanceData?.fungible_tokens) return [];

		return tokensData.map((token) => {
			const matchingKey = Object.keys(balanceData.fungible_tokens).find((key) =>
				key.startsWith(token.contract),
			);
			if (matchingKey) {
				const tokenBalance = balanceData.fungible_tokens[matchingKey].balance;
				return { ...token, balance: tokenBalance };
			}
			return token;
		});
	}, [tokensData, balanceData]);

	return {
		balanceData,
		isBalanceLoading,
		error,
		refetch,
		isRefetching,
		tokenIDS,
		isTokenLoading,
		tokensData,
		mergedTokens,
		isLoading: isBalanceLoading || isTokenLoading || isRefetching,
	};
}
