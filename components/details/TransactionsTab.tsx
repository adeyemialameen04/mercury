import { error } from "@stacks/transactions/dist/cl";
import React from "react";
import { View } from "react-native";
import { formatDateHeader, formatTransaction } from "~/utils/formatTransaction";
import { TokenItemSkeleton } from "../loading/TokenItemSkeleton";
import { Separator } from "../ui/separator";
import { TabsContent } from "../ui/tabs";
import { Muted } from "../ui/typography";
import { TransactionItem } from "./TransactionItem";
import { Text } from "../ui/text";

interface TransactionsTabProps {
	isLoading: boolean;
	groupedTransactions: any;
	error: unknown;
}
export default function TransactionsTab({
	isLoading,
	groupedTransactions,
	error,
}: TransactionsTabProps) {
	return (
		<TabsContent value="transactions" className="mt-4">
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
		</TabsContent>
	);
}
