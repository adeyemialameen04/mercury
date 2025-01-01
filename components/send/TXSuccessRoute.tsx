import { View } from "react-native";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { RouteScreenProps, SheetManager } from "react-native-actions-sheet";
import { Large, Muted } from "../ui/typography";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useRouter } from "expo-router";
import ActionButton from "../ActionButton";
import { useState } from "react";
import CopyButton from "../ui/Copy";
import { WalletData } from "~/types/wallet";
import { _handleOpenTxInExplorer } from "~/utils/openTxInExplorer";
import axios from "axios";
import { NOTIFICATION_SERVICE_URL } from "~/lib/constants";
import { useNotification } from "~/context/NotificationContext";

const truncateTxID = (txID: string) => {
	if (!txID) return "";
	return `${txID.slice(0, 16)}...${txID.slice(-10)}`;
};

export default function TxSuccessRoute({
	params,
}: RouteScreenProps<"confirm-tx-sheet", "confirm-tx-route">) {
	const { expoPushToken } = useNotification();
	const [isTracking, setIsTracking] = useState(false);
	const router = useRouter();
	const txID = params.txID as string;
	const walletData = params.walletData as WalletData;

	return (
		<View className="p-6 flex-col gap-4">
			{/* Move the flex classes to a View container */}
			<View className="flex flex-row items-center justify-center gap-2">
				<CheckCircle className="text-green-500" strokeWidth={1.25} />
				<Large className="text-center text-white">
					Transaction Broadcasted
				</Large>
			</View>
			<Muted className="text-center">
				Your transaction has been successfully submitted
			</Muted>
			<Button
				variant={"ghost"}
				className="flex-row gap-1 "
				onPress={async () => await _handleOpenTxInExplorer(txID)}
			>
				<Muted>See on </Muted>
				<Text className="text-white">Stacks Explorer</Text>
			</Button>
			<View className="flex flex-col gap-1">
				<Muted className="font-light uppercase">Transaction id</Muted>
				<View className="flex flex-row gap-2 items-center">
					<Text className="text-white">{truncateTxID(txID)}</Text>
					<CopyButton copyText={txID} />
				</View>
			</View>
			<View className="flex gap-2 flex-row">
				<Button
					variant={"default"}
					className="flex-1"
					onPress={() => {
						SheetManager.hide("confirm-tx-sheet");
						router.push("/(authenticated)/(tabs)/home");
					}}
				>
					<Text>Close</Text>
				</Button>
				<ActionButton
					loading={isTracking}
					text="Track"
					className="flex-1"
					variant={"outline"}
					onPress={async () => {
						try {
							setIsTracking(true);

							if (txID) {
								console.log("hello");
								const { data } = await axios.post(
									`${NOTIFICATION_SERVICE_URL}track`,
									{
										txID,
										address: walletData.address,
										expoPushToken,
									},
								);

								console.log(data);
							}
						} catch (error) {
							// Add appropriate error handling here
							// You might want to show an error message to the user
						} finally {
							setIsTracking(false);
						}
					}}
				/>
			</View>
		</View>
	);
}
