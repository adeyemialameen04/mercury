import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "~/components/ui/collapsible";
import { _handleOpenTxInExplorer } from "~/utils/openTxInExplorer";
import { truncateAddress } from "~/utils/truncateAddress";
import { Muted } from "../ui/typography";
import { File } from "~/lib/icons/File";
import { Coins } from "~/lib/icons/Coins";
import { Package } from "~/lib/icons/Package";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ExternalLink } from "~/lib/icons/ExternalLink";
import { Text } from "../ui/text";
import { formatTransaction } from "~/utils/formatTransaction";
import { getPrimaryBnsName } from "~/queries/bns";

interface TransactionItemProps {
	transaction: ReturnType<typeof formatTransaction>;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
	return (
		<View className="mb-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
			<Collapsible>
				<CollapsibleTrigger asChild className="relative">
					<View className="px-5 py-4 hover:bg-accent/50 active:bg-accent/70 relative">
						<View className="flex-1 flex-row items-center gap-4">
							<View className="bg-primary/15 p-2.5 rounded-xl">
								{transaction.type === "contract_call" ? (
									<File className="h-6 w-6 text-primary" strokeWidth={1.25} />
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
								<Text className="text-xs text-muted-foreground mt-0.5">
									{truncateAddress(transaction.id)}
								</Text>
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
										<Muted className="text-xs mb-1">Function</Muted>
										<Text className="text-sm font-medium">
											{transaction.details.functionName}
										</Text>
									</View>
								</View>
							</View>
						)}

						{/* Token Transfers */}
						{transaction.details.ftTransfers?.length > 0 && (
							<View className="mb-5 p-4 rounded-xl bg-background/80 border border-border/80 backdrop-blur-sm">
								<View className="flex-row items-center gap-2 mb-3">
									<Coins className="h-4 w-4 text-primary" strokeWidth={1.25} />
									<Text className="font-semibold">Token Transfers</Text>
								</View>
								{transaction.details.ftTransfers.map(
									async (transfer, index) => {
										const toBns = await getPrimaryBnsName(transfer.to);
										const toDisplay = toBns
											? toBns
											: truncateAddress(transfer.to);

										const fromBns = await getPrimaryBnsName(transfer.from);
										const fromDisplay = fromBns
											? fromBns
											: truncateAddress(transfer.to);

										return (
											<View
												key={index}
												className="py-3 border-b border-border/50 last:border-0"
											>
												<View className="flex-row items-center justify-between">
													<Text className="text-base font-semibold">
														{transfer.amount.toLocaleString()}
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
															From: {fromDisplay}
														</Muted>
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
								)}
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
