import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { H3, H4, Muted } from "~/components/ui/typography";
import ActionButton from "~/components/ActionButton";
import { useWalletStore } from "~/store/walletStore";
import HomeActions from "~/components/home/HomeActions";
import CopyButton from "~/components/ui/Copy";
import TokenList from "~/components/home/TokenList";
import { useNotification } from "~/context/NotificationContext";
import { useWalletBalance } from "~/hooks/useWalletBalance";
import { SelectToken } from "~/components/SelectToken";

export default function Page() {
	const { expoPushToken } = useNotification();
	const { walletData, isLoading: isWalletDataLoading } = useWalletStore();
	const { balanceData, isLoading, error, refetch, mergedTokens } =
		useWalletBalance(walletData);

	return (
		<ScrollView
			className="p-6 flex-1"
			bounces={false}
			overScrollMode="never"
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={isLoading} onRefresh={refetch} />
			}
		>
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
							{isLoading
								? "Loading..."
								: error
									? "Error loading balance"
									: `${Number(balanceData?.stx?.balance) / 1000000} STX` ||
										"0 STX"}
						</H3>
					</View>
					<View className="flex-1">
						<ActionButton
							loading={isLoading}
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
				isLoading={isLoading}
				bns={balanceData?.bns as string}
				stxAddr={walletData?.address as string}
			/>
			{/* <SelectToken mergedTokens={mergedTokens} isLoading={isLoading} /> */}
			{/* <MempoolTransactions walletData={walletData as WalletData} /> */}
			<TokenList mergedTokens={mergedTokens} isLoading={isLoading} />
		</ScrollView>
	);
}
