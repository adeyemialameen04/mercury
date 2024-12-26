import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { H3, H4, Muted } from "~/components/ui/typography";
import { useQuery } from "react-query";
import { Text } from "~/components/ui/text";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ActionButton from "~/components/ActionButton";
import { useWalletStore } from "~/store/walletStore";
import RecentTransactions from "~/components/home/RecentTransactions";
import HomeActions from "~/components/home/HomeActions";
import { getAccountBalance } from "~/queries/balance";
import CopyButton from "~/components/ui/Copy";

export default function Page() {
	const { walletData, isLoading: isWalletDataLoading } = useWalletStore();
	const [value, setValue] = useState("transfer");

	const {
		data: balanceData,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery(
		[`balance-${walletData?.address}`],
		() => (walletData?.address ? getAccountBalance(walletData.address) : null),
		{
			enabled: !!walletData?.address,
		},
	);

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
				<View className="flex justify-between  flex-row">
					<View className="flex flex-col gap-1 flex-1">
						<Muted>Total Balance</Muted>
						<H3>
							{isLoading
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
							onPress={async () => await refetch()}
						/>
					</View>
				</View>
			</View>
			<HomeActions balance={balanceData} />
			<RecentTransactions />
			<Tabs
				value={value}
				onValueChange={setValue}
				className="w-full max-w-[400px] mx-auto flex-col gap-1.5 mt-4"
			>
				<TabsList className="flex-row w-full">
					<TabsTrigger value="transfer" className="flex-1">
						<Text>Transfer</Text>
					</TabsTrigger>
					<TabsTrigger value="swap" className="flex-1">
						<Text>Password</Text>
					</TabsTrigger>
				</TabsList>
				{/* <TransferStxForm walletData={walletData as WalletData} /> */}
			</Tabs>
		</ScrollView>
	);
}
