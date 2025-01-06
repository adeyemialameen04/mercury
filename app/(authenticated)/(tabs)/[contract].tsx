import React, { memo, useCallback, useMemo, useState } from "react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { RefreshControl, ScrollView } from "react-native";
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
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
	AddressTransaction,
	AddressTransactionsV2ListResponse,
} from "~/types/transactions";
import { groupTransactionsByDate } from "~/utils/formatTransaction";
import DetailsActions from "~/components/details/DetailsActions";
import { getRecentTransactions } from "~/queries/transactions";
import TransactionsTab from "~/components/details/TransactionsTab";
import StxCityTab from "~/components/details/StxCityTab";
import { WalletData } from "~/types/wallet";

const TokenHeader = React.memo(
	({
		tokenData,
	}: {
		tokenData: TokenData;
	}) => (
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
	),
);

const TokenTabsContent = memo(
	({
		activeTab,
		isLoading,
		groupedTransactions,
		error,
		contractID,
		walletData,
	}: {
		activeTab: string;
		isLoading: boolean;
		groupedTransactions: any[];
		error: any;
		contractID: string;
		walletData: WalletData;
	}) => {
		if (activeTab === "transactions") {
			return (
				<TransactionsTab
					isLoading={isLoading}
					groupedTransactions={groupedTransactions}
					error={error}
				/>
			);
		}
		if (activeTab === "stx-city") {
			return <StxCityTab contractID={contractID} walletData={walletData} />;
		}
		return null;
	},
);

export default function Page() {
	const { tokenData: tokenDataStr, activeTab: activeTabFromParams } =
		useLocalSearchParams();
	const [activeTab, setActiveTab] = useState(
		activeTabFromParams ?? "transactions",
	);
	const { walletData } = useWalletStore();
	const tokenData: TokenData = JSON.parse(tokenDataStr as string);

	const {
		data: transactions,
		isLoading: isTransactionsLoading,
		error,
		refetch,
		isRefetching,
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

	const handleTabChange = useCallback((value: string) => {
		setActiveTab(value);
	}, []);

	// const contractCalls = transactions?.results?.filter(
	// 	(item: AddressTransaction) => item?.tx?.tx_type === "contract_call",
	// );

	const tokenTransactions = useMemo(() => {
		if (!transactions?.results) return [];
		return transactions.results.filter(
			(item: AddressTransaction) =>
				item?.tx?.tx_type === "contract_call" &&
				item.tx.contract_call.contract_id === tokenData.contract,
		);
	}, [transactions?.results, tokenData.contract]);

	// Memoize grouped transactions
	const groupedTransactions = useMemo(
		() => groupTransactionsByDate(tokenTransactions),
		[tokenTransactions],
	);

	return (
		<ScrollView
			className="flex-1 py-8"
			bounces={false}
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
			}
		>
			<Card className="w-full border-transparent">
				<TokenHeader tokenData={tokenData} />
				<CardContent className="flex flex-col gap-4">
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList className="flex-row w-full gap-4">
							<TabsTrigger value="transactions" className="flex-1">
								<Text>Transactions</Text>
							</TabsTrigger>
							<TabsTrigger value="market" className="flex-1">
								<Text>Market</Text>
							</TabsTrigger>
							<TabsTrigger value="stx-city" className="flex-1">
								<Text>Stx City</Text>
							</TabsTrigger>
						</TabsList>
						<TokenTabsContent
							activeTab={activeTab}
							isLoading={isTransactionsLoading}
							groupedTransactions={groupedTransactions}
							error={error}
							contractID={tokenData.contract}
							walletData={walletData as WalletData}
						/>
						{/* <TransactionsTab */}
						{/* 	isLoading={isTransactionsLoading} */}
						{/* 	groupedTransactions={groupedTransactions} */}
						{/* 	error={error} */}
						{/* /> */}
						{/* <StxCityTab */}
						{/* 	contractID={tokenData.contract} */}
						{/* 	walletData={walletData as WalletData} */}
						{/* /> */}
					</Tabs>
				</CardContent>
				<CardFooter />
			</Card>
		</ScrollView>
	);
}
