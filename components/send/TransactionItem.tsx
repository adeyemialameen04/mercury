import React from "react";
import { truncateAddress } from "~/utils/truncateAddress";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { formatTransaction } from "~/utils/formatTransaction";
import { Muted } from "../ui/typography";
import { _handleOpenTxInExplorer } from "~/utils/openTxInExplorer";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { File } from "~/lib/icons/File";
import { Coins } from "~/lib/icons/Coins";
import { Package } from "~/lib/icons/Package";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ExternalLink } from "~/lib/icons/ExternalLink";

interface TransactionItemProps {
	transaction: ReturnType<typeof formatTransaction>;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
	return (
		<AccordionItem
			value={transaction.id}
			className="mb-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm"
		>
			<AccordionTrigger className="px-5 py-4 hover:bg-accent/50 active:bg-accent/70 transition-colors">
				<View className="flex-1 flex-row items-center gap-4">
					{/* Icon based on transaction type */}
					<View className="bg-primary/15 p-2.5 rounded-xl">
						{transaction.type === "contract_call" ? (
							<File className="h-6 w-6 text-primary" strokeWidth={1.5} />
						) : transaction.type.includes("transfer") ? (
							<Coins className="h-6 w-6 text-primary" strokeWidth={1.5} />
						) : (
							<Package className="h-6 w-6 text-primary" strokeWidth={1.5} />
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
					onPress={async () => await _handleOpenTxInExplorer(transaction.id)}
					className="flex-row items-center justify-end space-x-1.5 mb-5"
				>
					<ExternalLink className="h-4 w-4 text-primary" strokeWidth={1.5} />
					<Text className="text-sm font-medium text-primary">
						View in Explorer
					</Text>
				</TouchableOpacity>

				{/* Contract Details */}
				{transaction.details.contractId && (
					<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
						<View className="flex-row items-center gap-2 mb-3">
							<File className="h-4 w-4 text-primary" strokeWidth={1.5} />
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
								<Muted className="text-xs mb-1">Function</Muted>
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
								<Coins className="h-4 w-4 text-primary" strokeWidth={1.5} />
								<Text className="font-semibold">Token Transfers</Text>
							</View>
							{transaction.details.ftTransfers.map((transfer, index) => (
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
												From: {truncateAddress(transfer.from)}
											</Muted>
										</View>
										<View className="flex-row items-center gap-2">
											<View className="h-2 w-2 rounded-full bg-green-500/20">
												<View className="h-1 w-1 rounded-full bg-green-500 m-0.5" />
											</View>
											<Muted className="text-xs">
												To: {truncateAddress(transfer.to)}
											</Muted>
										</View>
									</View>
								</View>
							))}
						</View>
					)}

				{/* NFT Transfers */}
				{transaction.details.nftTransfers &&
					transaction.details.nftTransfers.length > 0 && (
						<View className="p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
							<View className="flex-row items-center gap-2 mb-3">
								<Package className="h-4 w-4 text-primary" strokeWidth={1.5} />
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
			</AccordionContent>
		</AccordionItem>
	);
}

function TransactionItemOld({ transaction }: TransactionItemProps) {
	return (
		<Card className="mb-4">
			<CardContent className="p-4">
				<Text className="font-bold mb-2">{transaction.type}</Text>
				<Text className="text-sm text-gray-500 mb-2">
					{transaction.timestamp} (Block: {transaction.blockHeight})
				</Text>
				<TouchableOpacity
					onPress={async () => await _handleOpenTxInExplorer(transaction.id)}
				>
					<Muted className="text-xs mb-4">{transaction.id}</Muted>
				</TouchableOpacity>

				{transaction.details.contractId && (
					<View className="mb-2">
						<Text className="font-semibold">
							Contract: {transaction.details.contractId}
						</Text>
						<Text>Function: {transaction.details.functionName}</Text>
					</View>
				)}

				{transaction.details.ftTransfers && (
					<View className="mb-2">
						<Text className="font-semibold">Token Transfers:</Text>
						{transaction.details.ftTransfers.map((transfer, index) => (
							<Text key={index} className="text-sm">
								{transfer.amount} {transfer.asset.split("::")[1]} from{" "}
								{transfer.from} to {transfer.to}
							</Text>
						))}
					</View>
				)}

				{transaction.details.nftTransfers && (
					<View className="mb-2">
						<Text className="font-semibold">NFT Transfers:</Text>
						{transaction.details.nftTransfers.map((transfer, index) => (
							<Text key={index} className="text-sm">
								{transfer.asset} from {transfer.from} to {transfer.to}
							</Text>
						))}
					</View>
				)}
			</CardContent>
		</Card>
	);
}
