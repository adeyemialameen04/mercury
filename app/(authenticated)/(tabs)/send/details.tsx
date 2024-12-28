import React, { useMemo, useState } from "react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import { Large, Muted } from "~/components/ui/typography";
import { TokenData } from "~/types/token";
import { Text } from "~/components/ui/text";
import HomeActions from "~/components/home/HomeActions";
import { HIRO_API_BASE_URL } from "~/lib/constants";
import axios from "axios";
import { useWalletStore } from "~/store/walletStore";
import { useQuery } from "react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import {
	AddressTransaction,
	AddressTransactionsV2ListResponse,
} from "~/types/transactions";
import { TokenItemSkeleton } from "~/components/loading/TokenItemSkeleton";
import { TransactionItem } from "~/components/send/TransactionItem";
import {
	formatDateHeader,
	formatTransaction,
	groupTransactionsByDate,
} from "~/utils/formatTransaction";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { _handleOpenTxInExplorer } from "~/utils/openTxInExplorer";
import { truncateAddress } from "~/utils/truncateAddress";
import { File } from "~/lib/icons/File";
import { Coins } from "~/lib/icons/Coins";
import { Package } from "~/lib/icons/Package";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ExternalLink } from "~/lib/icons/ExternalLink";

const getRecentTransactions = async (
	stxAddr: string,
): Promise<AddressTransactionsV2ListResponse> => {
	try {
		const url = `${HIRO_API_BASE_URL}extended/v1/address/${stxAddr}/transactions_with_transfers?limit=50&offset=0`;
		const { data } = await axios.get<AddressTransactionsV2ListResponse>(url);
		return data;
	} catch (err) {
		throw new Error(
			err instanceof Error ? err.message : "Failed to fetch transactions",
		);
	}
};

export default function Page() {
	const [activeTab, setActiveTab] = useState("transactions");
	const { walletData } = useWalletStore();
	const { tokenData: tokenDataStr } = useLocalSearchParams();
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
					<HomeActions
						from="list"
						tokenData={tokenData}
						isLoading={isTransactionsLoading}
					/>
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
								groupedTransactions.map((group, groupIndex) => (
									<View key={group.date.toISOString()} className="mb-6">
										<View className="flex flex-row items-center gap-2 mb-4">
											<Muted>{formatDateHeader(group.date)}</Muted>
											<Separator className="flex-1" />
										</View>
										<Accordion
											type="multiple"
											collapsable
											className="flex flex-col gap-4"
										>
											{group.transactions.map((transactionAny, index) => {
												const transaction = formatTransaction(transactionAny);

												return (
													<AccordionItem
														key={transaction.id}
														value={transaction.id}
														className="mb-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm"
													>
														<AccordionTrigger className="px-5 py-4 hover:bg-accent/50 active:bg-accent/70 transition-colors">
															<View className="flex-1 flex-row items-center gap-4">
																{/* Icon based on transaction type */}
																<View className="bg-primary/15 p-2.5 rounded-xl">
																	{transaction.type === "contract_call" ? (
																		<File
																			className="h-6 w-6 text-primary"
																			strokeWidth={1.5}
																		/>
																	) : transaction.type.includes("transfer") ? (
																		<Coins
																			className="h-6 w-6 text-primary"
																			strokeWidth={1.5}
																		/>
																	) : (
																		<Package
																			className="h-6 w-6 text-primary"
																			strokeWidth={1.5}
																		/>
																	)}
																</View>

																<View className="flex-1">
																	<Text className="font-semibold text-base capitalize">
																		{transaction.type.replace("_", " ")}
																	</Text>
																	<Text className="text-xs text-muted-foreground mt-0.5">
																		{truncateAddress(transaction.id)}
																	</Text>
																</View>

																<ChevronRight className="h-5 w-5 text-muted-foreground transform transition-transform duration-200 group-data-[state=open]:rotate-90" />
															</View>
														</AccordionTrigger>

														<AccordionContent className="px-5 py-4 bg-accent/10">
															{/* Explorer Link */}
															<TouchableOpacity
																onPress={async () =>
																	await _handleOpenTxInExplorer(transaction.id)
																}
																className="flex-row items-center justify-end space-x-1.5 mb-5"
															>
																<ExternalLink
																	className="h-4 w-4 text-primary"
																	strokeWidth={1.5}
																/>
																<Text className="text-sm font-medium text-primary">
																	View in Explorer
																</Text>
															</TouchableOpacity>

															{/* Contract Details */}
															{transaction.details.contractId && (
																<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
																	<View className="flex-row items-center gap-2 mb-3">
																		<File
																			className="h-4 w-4 text-primary"
																			strokeWidth={1.5}
																		/>
																		<Text className="font-semibold">
																			Contract Details
																		</Text>
																	</View>
																	<View className="space-y-2">
																		<View>
																			<Muted className="text-xs mb-1">
																				Contract ID
																			</Muted>
																			<Text className="text-sm font-medium break-all">
																				{transaction.details.contractId}
																			</Text>
																		</View>
																		<View>
																			<Muted className="text-xs mb-1">
																				Function
																			</Muted>
																			<Text className="text-sm font-medium">
																				{transaction.details.functionName}
																			</Text>
																		</View>
																	</View>
																</View>
															)}

															{/* Token Transfers */}
															{transaction.details.ftTransfers &&
																transaction.details.ftTransfers.length > 0 && (
																	<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
																		<View className="flex-row items-center gap-2 mb-3">
																			<Coins
																				className="h-4 w-4 text-primary"
																				strokeWidth={1.5}
																			/>
																			<Text className="font-semibold">
																				Token Transfers
																			</Text>
																		</View>
																		{transaction.details.ftTransfers.map(
																			(transfer, index) => (
																				<View
																					key={index}
																					className="py-3 border-b border-border/50 last:border-0"
																				>
																					<View className="flex-row items-center justify-between">
																						<Text className="text-base font-semibold">
																							{transfer.amount}
																						</Text>
																						<Text className="text-sm font-medium text-muted-foreground">
																							{transfer.asset.split("::")[1]}
																						</Text>
																					</View>
																					<View className="mt-2 space-y-1">
																						<View className="flex-row items-center gap-2">
																							<View className="h-2 w-2 rounded-full bg-red-500/20">
																								<View className="h-1 w-1 rounded-full bg-red-500 m-0.5" />
																							</View>
																							<Muted className="text-xs">
																								From:{" "}
																								{truncateAddress(transfer.from)}
																							</Muted>
																						</View>
																						<View className="flex-row items-center gap-2">
																							<View className="h-2 w-2 rounded-full bg-green-500/20">
																								<View className="h-1 w-1 rounded-full bg-green-500 m-0.5" />
																							</View>
																							<Muted className="text-xs">
																								To:{" "}
																								{truncateAddress(transfer.to)}
																							</Muted>
																						</View>
																					</View>
																				</View>
																			),
																		)}
																	</View>
																)}

															{/* NFT Transfers */}
															{transaction.details.nftTransfers &&
																transaction.details.nftTransfers.length > 0 && (
																	<View className="p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
																		<View className="flex-row items-center gap-2 mb-3">
																			<Package
																				className="h-4 w-4 text-primary"
																				strokeWidth={1.5}
																			/>
																			<Text className="font-semibold">
																				NFT Transfers
																			</Text>
																		</View>
																		{transaction.details.nftTransfers.map(
																			(transfer, index) => (
																				<View
																					key={index}
																					className="py-3 border-b border-border/50 last:border-0"
																				>
																					<Text className="text-base font-semibold">
																						{transfer.asset}
																					</Text>
																					<View className="mt-2 space-y-1">
																						<View className="flex-row items-center gap-2">
																							<View className="h-2 w-2 rounded-full bg-red-500/20">
																								<View className="h-1 w-1 rounded-full bg-red-500 m-0.5" />
																							</View>
																							<Muted className="text-xs">
																								From: {transfer.from}
																							</Muted>
																						</View>
																						<View className="flex-row items-center gap-2">
																							<View className="h-2 w-2 rounded-full bg-green-500/20">
																								<View className="h-1 w-1 rounded-full bg-green-500 m-0.5" />
																							</View>
																							<Muted className="text-xs">
																								To: {transfer.to}
																							</Muted>
																						</View>
																					</View>
																				</View>
																			),
																		)}
																	</View>
																)}
														</AccordionContent>
													</AccordionItem>
												);
											})}
										</Accordion>
										{/*               												<TransactionItem */}
										{/* 	key={transaction.tx.tx_id} */}
										{/* 	transaction={formatTransaction(transaction)} */}
										{/* /> */}
										{/* <View className="flex flex-col gap-4"> */}
										{/* 	{group.transactions.map((transaction, index) => ( */}
										{/* 		<TransactionItem */}
										{/* 			key={transaction.tx.tx_id} */}
										{/* 			transaction={formatTransaction(transaction)} */}
										{/* 		/> */}
										{/* 	))} */}
										{/* </View> */}
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
// contractCalls.map(
// 	(item: AddressTransaction, index: number) => (
// 		<View
// 			key={index}
// 			className="flex justify-between items-center flex-row"
// 		>
// 			<Text>{item.tx.contract_call.function_name}</Text>
// 		</View>
// 	),
// )
