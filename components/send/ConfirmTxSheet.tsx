import { View } from "react-native";
import ActionSheet, {
	SheetManager,
	SheetProps,
} from "react-native-actions-sheet";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { Large, Muted } from "../ui/typography";
import { Button } from "../ui/button";
import ActionButton from "../ActionButton";
import { useRouter } from "expo-router";
import { TokenData } from "~/types/token";
import { send } from "~/lib/services/send";
import { useState } from "react";
import { useWalletStore } from "~/store/walletStore";
import { WalletData } from "~/types/wallet";

const truncateAddress = (address) => {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function ConfirmTxSheet(
	props: SheetProps<"confirm-transaction">,
) {
	const { walletData } = useWalletStore();
	const tokenData: TokenData = props.payload?.tokenData;
	const [isSending, setIsSending] = useState(false);
	const buyParams = props.payload?.buyParams;
	const router = useRouter();
	return (
		<ActionSheet
			id={props.sheetId}
			closable={false}
			containerStyle={{
				backgroundColor: "#27282A",
			}}
		>
			<View className="p-6 flex-col">
				<Large className="text-white">Review Transaction</Large>
				<View className="flex flex-col gap-2">
					<Muted className="mt-3">You will send</Muted>
					<View className="flex p-4 bg-secondary-foreground rounded-md flex-col gap-3">
						<View className="flex items-center flex-row justify-between">
							<Text className="text-white">To</Text>
							<Text className="text-white">
								{truncateAddress(buyParams.receiverAddr)}
							</Text>
						</View>
						<View className="flex items-center flex-row justify-between">
							<View className="flex items-center gap-2 flex-row">
								<Image
									source={tokenData?.image}
									contentFit="cover"
									style={{ height: 30, width: 30, borderRadius: 25 }}
									transition={1000}
								/>
								<Text className="text-white">Amount</Text>
							</View>
							<View className="flex flex-col">
								<Text className="text-white font-semibold">
									{buyParams.amount} {tokenData.ticker}
								</Text>
							</View>
						</View>
					</View>
					<View className="flex gap-2 flex-row">
						<Button
							variant={"default"}
							className="flex-1"
							onPress={() => {
								SheetManager.hide(props.sheetId);
								router.push("/(authenticated)/(tabs)/home");
							}}
						>
							<Text>Cancel</Text>
						</Button>
						<ActionButton
							loading={isSending}
							text="Confirm"
							className="flex-1"
							variant={"outline"}
							onPress={async () => {
								try {
									setIsSending(true);
									const txRes = await send(
										buyParams,
										tokenData,
										walletData as WalletData,
									);
									console.log("Transaction result:", txRes);
								} catch (error) {
									console.error("Transaction failed:", error);
									// Add appropriate error handling here
									// You might want to show an error message to the user
								} finally {
									setIsSending(false);
								}
							}}
						/>
					</View>
				</View>
			</View>
		</ActionSheet>
	);
}
