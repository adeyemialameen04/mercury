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
const truncateAddress = (address) => {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
export default function ConfirmTxSheet(
	props: SheetProps<"confirm-transaction">,
) {
	const tokenData = props.payload?.tokenData;
	const buyParams = props.payload?.buyParams;
	console.log(buyParams, tokenData);
	const router = useRouter();
	return (
		<ActionSheet
			id={props.sheetId}
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
									{tokenData.formattedBalAmt} {tokenData.ticker}
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
							loading
							text="Confirm"
							className="flex-1"
							variant={"outline"}
						/>
					</View>
				</View>
			</View>
		</ActionSheet>
	);
}
