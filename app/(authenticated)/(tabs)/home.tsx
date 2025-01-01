import React from "react";
import { ScrollView, View } from "react-native";
import { H3, H4, Large, Muted } from "~/components/ui/typography";
import { useQuery } from "react-query";
import ActionButton from "~/components/ActionButton";
import { useWalletStore } from "~/store/walletStore";
import HomeActions from "~/components/home/HomeActions";
import { getAccountBalance } from "~/queries/balance";
import CopyButton from "~/components/ui/Copy";
import TokenList from "~/components/home/TokenList";
import { getTokens } from "~/queries/token";
import { useNotification } from "~/context/NotificationContext";
import { AccountBalance } from "~/types/balance";

export default function Page() {
	const { expoPushToken } = useNotification();
	const { walletData, isLoading: isWalletDataLoading } = useWalletStore();

	// First query - get balance
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

	const tokenIDS = React.useMemo(() => {
		if (!balanceData?.fungible_tokens) return [];
		return Object.keys(balanceData.fungible_tokens).map(
			(key) => key.split("::")[0],
		);
	}, [balanceData]);

	const { isLoading: isTokenLoading, data: tokensData } = useQuery(
		[`tokens-${walletData?.address}`, tokenIDS],
		() => getTokens(tokenIDS),
		{
			enabled: !!walletData?.address && tokenIDS.length > 0,
		},
	);

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

	return (
		<ScrollView className="p-6 flex-1">
			<View className="flex flex-col justify-between gap-4">
				<View className="flex flex-col gap-1">
					<H4>Wallet</H4>
					<View className="flex gap-2 items-center flex-row">
						<Muted className="">
							{isWalletDataLoading ? "..." : walletData?.address}
						</Muted>
						<CopyButton copyText={walletData?.address as string} />
					</View>
				</View>
				<View className="flex justify-between flex-row">
					<View className="flex flex-col gap-1 flex-1">
						<Muted>Total Balance</Muted>
						<H3>
							{isBalanceLoading
								? "Loading..."
								: error
									? "Error loading balance"
									: `${balanceData?.stx?.balance / 1000000} STX` || "0 STX"}
						</H3>
					</View>
					<View className="flex-1">
						<ActionButton
							loading={isRefetching}
							text="Refresh"
							variant={"secondary"}
							onPress={async () => {
								await refetch();
								console.log(expoPushToken);
							}}
						/>
					</View>
				</View>
			</View>
			<HomeActions
				mergedTokens={mergedTokens}
				isLoading={isBalanceLoading || isTokenLoading || isRefetching}
				bns={balanceData?.bns}
				stxAddr={walletData?.address}
			/>
			<TokenList
				mergedTokens={mergedTokens}
				isLoading={isBalanceLoading || isTokenLoading || isRefetching}
			/>
		</ScrollView>
	);
}
