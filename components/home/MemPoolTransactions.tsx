import { useRotationAnimation } from "~/hooks/useRotation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RefreshCw } from "~/lib/icons/RefreshCw";
import { Animated, View } from "react-native";
import { Button } from "../ui/button";
import { useQuery } from "react-query";
import { MempoolTransaction } from "~/types/mempool";
import { WalletData } from "~/types/wallet";
import { getAddressMempoolTransactions } from "~/queries/transactions";
import { TransactionItem } from "../send/TransactionItem";
import {
	formatDateHeader,
	formatTransaction,
	groupTransactionsByDate,
} from "~/utils/formatTransaction";
import { useEffect, useMemo } from "react";
import {
	AddressTransaction,
	AddressTransactionsV2ListResponse,
} from "~/types/transactions";
import React from "react";
import { TokenItemSkeleton } from "../loading/TokenItemSkeleton";
import { Separator } from "../ui/separator";
import { Muted } from "../ui/typography";
import { Text } from "../ui/text";

export default function MempoolTransactions({
	walletData,
}: { walletData: WalletData }) {
	const rotationAnimation = useRotationAnimation();
	const {
		data: mempoolTransactions,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery<AddressTransactionsV2ListResponse | null>(
		[`mempool-${walletData?.address}`],
		() =>
			walletData?.address
				? getAddressMempoolTransactions(walletData.address)
				: null,
		{
			enabled: !!walletData?.address,
		},
	);

	const contractCalls = mempoolTransactions?.results?.filter(
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

	useEffect(() => {
		console.log(mempoolTransactions);
	}, [mempoolTransactions]);

	//  	const contractCalls = mempoolTransactions?.results?.filter(
	// 	(item: AddressTransaction) => item?.tx?.tx_type === "contract_call",
	// );
	//
	// const tokenTransactions = contractCalls?.filter(
	// 	(item: AddressTransaction) =>
	// 		item.tx.contract_call.contract_id === tokenData.contract,
	// );
	//
	// const groupedTransactions = useMemo(() => {
	// 	if (!tokenTransactions) return [];
	// 	return groupTransactionsByDate(tokenTransactions);
	// }, [tokenTransactions]);

	return (
		<Card className="w-full my-4">
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle className="text-lg">Mempool Transactions</CardTitle>
				<Button variant={"secondary"}>
					<Animated.View style={rotationAnimation}>
						<RefreshCw className="text-primary" size={18} strokeWidth={1.25} />
					</Animated.View>
				</Button>
			</CardHeader>
			<CardContent>
				{isLoading ? (
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
			</CardContent>
		</Card>
	);
}
