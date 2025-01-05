import { Text } from "../ui/text";
import { User2 } from "~/lib/icons/User2";
import { DollarSign } from "~/lib/icons/DollarSign";
import { File } from "~/lib/icons/File";
import { User } from "~/lib/icons/User";
import { Hash } from "~/lib/icons/Hash";
import { Muted } from "../ui/typography";
import { truncateAddress, truncateTXID } from "~/utils/truncate";
import { Badge } from "../ui/badge";
import { View, TouchableOpacity } from "react-native";
import { Top } from "~/types/stxcity-mempool";
import {
	_handleOpenAddressInExplorer,
	_handleOpenTxInExplorer,
} from "~/utils/browser";

const OpenInExplorer = ({
	text,
	type,
}: { text: string; type: "address" | "txID" }) => {
	return (
		<TouchableOpacity
			onPress={() => {
				if (type === "address") {
					_handleOpenAddressInExplorer(text);
				} else if (type === "txID") {
					_handleOpenTxInExplorer(text);
				}
			}}
		>
			<Text className="text-blue-500">
				{type === "address" ? truncateAddress(text) : truncateTXID(text)}
				{/* {truncateAddress(tx.token_transfer?.recipient_address as string)} */}
			</Text>
		</TouchableOpacity>
	);
};

export const TxItem = ({ top: tx }: { top: Top }) => {
	return (
		<View className="flex flex-col gap-2 shadow-sm rounded-lg p-2">
			<View className="flex flex-row gap-2">
				<View className="flex flex-row items-center">
					<Hash
						className="text-muted-foreground"
						strokeWidth={1.25}
						size={17}
					/>
					<Muted className="text-base">TX: </Muted>
				</View>
				<OpenInExplorer text={truncateTXID(tx.tx_id as string)} type="txID" />
				<Badge>
					<Text>{Number(tx.fee_rate) / 10_000_000} STX</Text>
				</Badge>
			</View>
			<View className="flex flex-row">
				<View className="flex flex-row items-center gap-1">
					<User
						className="text-muted-foreground"
						strokeWidth={1.25}
						size={17}
					/>
					<Muted className="text-base">
						{tx.tx_type === "token_transfer" ? "Sender: " : "Maker: "}
					</Muted>
				</View>
				<OpenInExplorer text={tx.sender_address as string} type="address" />
			</View>
			{tx.tx_type === "token_transfer" && (
				<View className="flex flex-row">
					<View className="flex flex-row items-center gap-1">
						<User2
							className="text-muted-foreground"
							strokeWidth={1.25}
							size={17}
						/>
						<Muted className="text-base">Receiver: </Muted>
					</View>
					<OpenInExplorer
						text={tx.token_transfer?.recipient_address as string}
						type="address"
					/>
				</View>
			)}
			{tx.tx_type === "token_transfer" && (
				<View className="flex flex-row">
					<View className="flex flex-row items-center gap-1">
						<DollarSign
							className="text-muted-foreground"
							strokeWidth={1.25}
							size={17}
						/>
						<Muted className="text-base">Amount: </Muted>
					</View>
					<Text className="">
						{Number(tx.token_transfer?.amount) / 1_000_000} STX
					</Text>
				</View>
			)}
			{tx.tx_type === "contract_call" && (
				<View className="flex flex-row">
					<View className="flex flex-row items-center gap-1">
						<File
							className="text-muted-foreground"
							strokeWidth={1.25}
							size={17}
						/>
						<Muted className="text-base">Contract Name: </Muted>
					</View>
					<Text className="">{tx.contract_call?.function_name}</Text>
				</View>
			)}
		</View>
	);
};
