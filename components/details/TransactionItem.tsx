import React, { useEffect, useState } from "react";
import { setStringAsync } from "expo-clipboard";
import { View, TouchableOpacity } from "react-native";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "~/components/ui/collapsible";
import { _handleOpenTxInExplorer } from "~/utils/browser";
import { truncateAddress } from "~/utils/truncate";
import { Muted } from "../ui/typography";
import { File } from "~/lib/icons/File";
import { Coins } from "~/lib/icons/Coins";
import { Package } from "~/lib/icons/Package";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ExternalLink } from "~/lib/icons/ExternalLink";
import { Text } from "../ui/text";
import { formatTransaction } from "~/utils/formatTransaction";
import { getPrimaryBnsName } from "~/queries/bns";
import { useQuery } from "react-query";
import { cn } from "~/lib/utils";

interface TransactionItemProps {
	transaction: ReturnType<typeof formatTransaction>;
}

const TransferDetails = React.memo(
	({ transfer, index }: { transfer: any; index: number }) => {
		// Use separate queries for 'to' and 'from' BNS names
		const { data: toBns } = useQuery(
			["bnsName", transfer.to],
			() => getPrimaryBnsName(transfer.to),
			{
				// Only fetch if it's an address that needs resolving
				enabled: !!transfer.to,
				// Cache the results for 1 hour since BNS names don't change often
				cacheTime: 1000 * 60 * 60,
				// Show stale data while refetching
				staleTime: 1000 * 60 * 60,
				// Start with truncated address
				placeholderData: truncateAddress(transfer.to),
			},
		);

		const { data: fromBns } = useQuery(
			["bnsName", transfer.from],
			() => getPrimaryBnsName(transfer.from),
			{
				enabled: !!transfer.from,
				cacheTime: 1000 * 60 * 60,
				staleTime: 1000 * 60 * 60,
				placeholderData: truncateAddress(transfer.from),
			},
		);

		// Use the BNS name if available, otherwise use truncated address
		const toDisplay = toBns || truncateAddress(transfer.to);
		const fromDisplay = fromBns || truncateAddress(transfer.from);

		return (
			<View
				key={index}
				className="py-3 border-b border-border/50 last:border-0"
			>
				<View className="flex-row items-center justify-between">
					<Text className="text-base font-semibold">
						{transfer.amount?.toLocaleString()}
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
						<Muted className="text-xs">From: {fromDisplay}</Muted>
					</View>
					<View className="flex-row items-center gap-2">
						<View className="h-2 w-2 rounded-full bg-green-500/20">
							<View className="h-1 w-1 rounded-full bg-green-500 m-0.5" />
						</View>
						<Muted className="text-xs">To: {toDisplay}</Muted>
					</View>
				</View>
			</View>
		);
	},
);

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const renderTransfers = isOpen && transaction.details.ftTransfers;
	return (
		<View className="mb-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild className="relative">
					<View className="px-5 py-4 hover:bg-accent/50 active:bg-accent/70 relative">
						<View className="flex-1 flex-row items-center gap-4">
							<View className="bg-primary/15 p-2.5 rounded-xl">
								{transaction.type === "contract_call" ? (
									<File
										className={cn(
											"h-6 w-6",
											transaction.tx_status === "success"
												? "text-green-600"
												: "text-destructive",
										)}
										strokeWidth={1.25}
									/>
								) : transaction.type.includes("transfer") ? (
									<Coins className="h-6 w-6 text-primary" strokeWidth={1.25} />
								) : (
									<Package
										className="h-6 w-6 text-primary"
										strokeWidth={1.25}
									/>
								)}
							</View>

							<View className="flex-1">
								<Text className="font-semibold text-base capitalize">
									{transaction.type.replace("_", " ")}
								</Text>
								<TouchableOpacity
									onPress={async () => {
										await setStringAsync(transaction.id);
									}}
								>
									<Muted className="">{truncateAddress(transaction.id)}</Muted>
								</TouchableOpacity>
							</View>

							<ChevronRight
								className="h-5 w-5 text-muted-foreground"
								style={{
									transform: [{ rotate: "0deg" }],
								}}
							/>
						</View>
					</View>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<View className="px-5 py-4 bg-accent/10">
						{/* Explorer Link */}
						<TouchableOpacity
							onPress={async () =>
								await _handleOpenTxInExplorer(transaction.id)
							}
							className="flex-row items-center justify-end gap-2 mb-5 w-fit"
						>
							<ExternalLink
								className="h-3 w-3 text-primary"
								strokeWidth={1.25}
							/>
							<Text className="text-sm font-medium text-primary">
								View in Explorer
							</Text>
						</TouchableOpacity>

						{/* Contract Details */}
						{transaction.details.contractId && (
							<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
								<View className="flex-row items-center gap-2 mb-3">
									<File className="h-4 w-4 text-primary" strokeWidth={1.25} />
									<Text className="font-semibold">Contract Details</Text>
								</View>
								<View className="space-y-2">
									<View>
										<Muted className="text-xs mb-1">Contract ID</Muted>
										<Text className="text-sm font-medium break-all">
											{transaction.details.contractId}
										</Text>
									</View>
									<View>
										<Muted className="text-xs">Function</Muted>
										<Text className="text-sm font-medium">
											{transaction.details.functionName}
										</Text>
										{/* <Text> {transaction.tx_status.replace("_", " ")}</Text> */}
									</View>
								</View>
							</View>
						)}

						{/* Token Transfers */}
						{renderTransfers && (
							<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
								<View className="flex-row items-center gap-2 mb-3">
									<Coins className="h-4 w-4 text-primary" strokeWidth={1.25} />
									<Text className="font-semibold">Token Transfers</Text>
								</View>
								{transaction.details.ftTransfers.map((transfer, index) => (
									<TransferDetails
										key={index}
										transfer={transfer}
										index={index}
									/>
								))}
							</View>
						)}

						{/* NFT Transfers */}
						{transaction.details.nftTransfers?.length > 0 && (
							<View className="p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
								<View className="flex-row items-center gap-2 mb-3">
									<Package
										className="h-4 w-4 text-primary"
										strokeWidth={1.25}
									/>
									<Text className="font-semibold">NFT Transfers</Text>
								</View>
								{transaction.details.nftTransfers.map((transfer, index) => (
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
												<Muted className="text-xs">From: {transfer.from}</Muted>
											</View>
											<View className="flex-row items-center gap-2">
												<View className="h-2 w-2 rounded-full bg-green-500/20">
													<View className="h-1 w-1 rounded-full bg-green-500 m-0.5" />
												</View>
												<Muted className="text-xs">To: {transfer.to}</Muted>
											</View>
										</View>
									</View>
								))}
							</View>
						)}
					</View>
				</CollapsibleContent>
			</Collapsible>
		</View>
	);
};
