import {
	BottomSheetContent,
	BottomSheetHeader,
	BottomSheet,
	BottomSheetView,
	BottomSheetFooter,
} from "../ui/bottom-sheet.native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import axios from "axios";
import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { View } from "react-native";
import { NOTIFICATION_SERVICE_URL } from "~/lib/constants";
import { _handleOpenTxInExplorer } from "~/utils/browser";
import ActionButton from "../ActionButton";
import CopyButton from "../ui/Copy";
import { Large, Muted } from "../ui/typography";
import { WalletData } from "~/types/wallet";
import { truncateTXID } from "~/utils/truncate";
import { useState, useCallback } from "react";
import { useNotification } from "~/context/NotificationContext";

interface StxCityTransactionBroadcastedSheetProps {
	walletData: WalletData;
	txID: string;
	sheetRef: any;
}

export function StxCityTransactionBroadcastedSheet({
	sheetRef,
	txID,
	walletData,
}: StxCityTransactionBroadcastedSheetProps) {
	const { dismiss } = useBottomSheetModal();
	const { expoPushToken } = useNotification();
	const [isTracking, setIsTracking] = useState(false);

	const renderFooter = useCallback(
		(props) => (
			<BottomSheetFooter
				bottomSheetFooterProps={props}
				className="flex gap-2 flex-row"
			>
				<Button
					variant={"default"}
					className="flex-1"
					onPress={() => {
						dismiss();
						// router.replace("/(authenticated)/(tabs)/home");
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
							console.error(error);
						} finally {
							setIsTracking(false);
						}
					}}
				/>
			</BottomSheetFooter>
		),
		[dismiss, isTracking, txID, walletData.address, expoPushToken],
	);

	return (
		<BottomSheet className="flex-1">
			<BottomSheetContent ref={sheetRef} footerComponent={renderFooter}>
				<BottomSheetView className="">
					<BottomSheetHeader className="px-0">
						<Text>TX Successful</Text>
					</BottomSheetHeader>
					<View className="flex flex-row items-center justify-center gap-2 mt-4">
						<CheckCircle className="text-green-500" strokeWidth={1.25} />
						<Large className="text-center">Transaction Broadcasted</Large>
					</View>
					<Muted className="text-center">
						Your transaction has been successfully submitted
					</Muted>
					<Button
						variant={"ghost"}
						className="flex-row gap-1 my-2"
						onPress={async () => await _handleOpenTxInExplorer(txID)}
					>
						<Muted>See on </Muted>
						<Text className="">Stacks Explorer</Text>
					</Button>
					<View className="flex flex-col gap-1">
						<Muted className="font-light uppercase">Transaction id</Muted>
						<View className="flex flex-row gap-2 items-center">
							<Text className="">{truncateTXID(txID)}</Text>
							<CopyButton copyText={txID} />
						</View>
					</View>
				</BottomSheetView>
			</BottomSheetContent>
		</BottomSheet>
	);
}
