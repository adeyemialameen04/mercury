import React, { useMemo, useState } from "react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import { Large, Muted } from "~/components/ui/typography";
import { TokenData } from "~/types/token";
import { Text } from "~/components/ui/text";
import { useWalletStore } from "~/store/walletStore";
import { useQuery } from "react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import {
	AddressTransaction,
	AddressTransactionsV2ListResponse,
} from "~/types/transactions";
import { TokenItemSkeleton } from "~/components/loading/TokenItemSkeleton";
import {
	formatDateHeader,
	formatTransaction,
	groupTransactionsByDate,
} from "~/utils/formatTransaction";
import { _handleOpenTxInExplorer } from "~/utils/openTxInExplorer";
import DetailsActions from "~/components/details/DetailsActions";
import { getRecentTransactions } from "~/queries/transactions";
import { TransactionItem } from "~/components/details/TransactionItem";

export default function Page() {
	const [activeTab, setActiveTab] = useState("transactions");
	const { walletData } = useWalletStore();
	const { tokenData: tokenDataStr } = useLocalSearchParams();
	const tokenData: TokenData = JSON.parse(tokenDataStr as string);

	const {
		data: transactions,
		isLoading: isTransactionsLoading,
		error,
	} = useQuery<AddressTransactionsV2ListResponse>(
		[`transactions-${walletData?.address}`],
		async () => {
			if (!walletData?.address) {
				throw new Error("Wallet address is not defined.");
			}
			return getRecentTransactions(walletData.address);
		},
		{
			enabled: !!walletData?.address,
		},
	);

	const contractCalls = transactions?.results?.filter(
		(item: AddressTransaction) => item?.tx?.tx_type === "contract_call",
	);

	const tokenTransactions = contractCalls?.filter(
		(item: AddressTransaction) =>
			item.tx.contract_call.contract_id === tokenData.contract,
	);

	const groupedTransactions = useMemo(() => {
		if (!tokenTransactions) return [];
		return groupTransactionsByDate(tokenTransactions);
	}, [tokenTransactions]);

	return (
		<ScrollView
			className="flex-1 py-8"
			bounces={false}
			overScrollMode="never"
			showsVerticalScrollIndicator={false}
		>
			<Card className="w-full border-transparent">
				<CardHeader className="items-center space-y-4">
					<Image
						source={tokenData?.image}
						contentFit="cover"
						style={{ height: 50, width: 50, borderRadius: 25 }}
						transition={1000}
					/>
					<Muted className="font-semibold">{tokenData?.name}</Muted>
					<Large>
						{tokenData.formattedBalAmt} {tokenData.ticker}
					</Large>
					<Text>
						{tokenData.currentPrice !== undefined
							? (tokenData.currentPrice * tokenData.formattedBalAmt).toFixed(2)
							: 0}{" "}
						USD
					</Text>
					<DetailsActions tokenData={tokenData} />
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="flex-row w-full gap-4">
							<TabsTrigger value="transactions" className="flex-1">
								<Text>Transactions</Text>
							</TabsTrigger>
							<TabsTrigger value="market" className="flex-1">
								<Text>Market</Text>
							</TabsTrigger>
						</TabsList>
						<TabsContent value="transactions" className="mt-4">
							{isTransactionsLoading ? (
								<>
									<TokenItemSkeleton />
									<TokenItemSkeleton />
									<TokenItemSkeleton />
								</>
							) : error ? (
								<Text className="text-red-500">Error loading transactions</Text>
							) : groupedTransactions.length === 0 ? (
								<View className="flex items-center py-8">
									<Text className="text-gray-500">No transactions found</Text>
								</View>
							) : (
								groupedTransactions.map((group) => (
									<View key={group.date.toISOString()} className="mb-6">
										<View className="flex flex-row items-center gap-2 mb-4">
											<Muted>{formatDateHeader(group.date)}</Muted>
											<Separator className="flex-1" />
										</View>
										{group.transactions.map((transaction) => (
											<TransactionItem
												key={formatTransaction(transaction).id}
												transaction={formatTransaction(transaction)}
											/>
										))}
									</View>
								))
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter />
			</Card>
		</ScrollView>
	);
}
