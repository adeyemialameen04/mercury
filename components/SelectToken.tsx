import { useSharedValue } from "react-native-reanimated";
import {
	BottomSheetOpenTrigger,
	BottomSheetContent,
	BottomSheet,
	BottomSheetView,
	BottomSheetFlatList,
	BottomSheetHeader,
} from "./ui/bottom-sheet.native";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Send } from "~/lib/icons/Send";
import { H3, Muted, Small } from "./ui/typography";
import { TokenItemSkeleton } from "./loading/TokenItemSkeleton";
import { Image } from "expo-image";
import { Text } from "./ui/text";
import { Link } from "expo-router";
import { useCallback } from "react";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "./ui/button";

interface SelectTokenProps {
	mergedTokens: any;
	isLoading: boolean;
	receiverAddr?: string;
}
export function SelectToken({
	mergedTokens,
	isLoading,
	receiverAddr,
}: SelectTokenProps) {
	const { dismiss } = useBottomSheetModal();

	// const { ref } = useBottomSheet();
	// ref.current.
	const animatedPosition = useSharedValue(10);
	const snapPoints = ["90%"];

	const renderItem = useCallback(
		({ item }) => <TokenItem receiverAddr={receiverAddr} item={item} />,
		[],
	);

	return (
		<BottomSheet className="flex-1">
			<BottomSheetOpenTrigger asChild className="flex-1 w-full">
				<Pressable className="flex flex-col w-full flex-1 rounded-md max-h-none bg-muted items-center justify-center gap-3 py-3">
					{<Send className="text-primary" strokeWidth={1.25} />}
					<Small className="mx-auto text-center">Send</Small>
				</Pressable>
			</BottomSheetOpenTrigger>

			<BottomSheetContent snapPoints={snapPoints}>
				<BottomSheetView className="">
					<BottomSheetHeader className="px-0">
						<Text>Select a coin to send</Text>
					</BottomSheetHeader>

					{isLoading ? (
						<View className="flex flex-col gap-4">
							<TokenItemSkeleton />
							<TokenItemSkeleton />
							<TokenItemSkeleton />
							<TokenItemSkeleton />
							<TokenItemSkeleton />
						</View>
					) : mergedTokens && mergedTokens.length > 0 ? (
						<BottomSheetFlatList
							data={mergedTokens}
							renderItem={renderItem}
							showsVerticalScrollIndicator={false}
						/>
					) : (
						<H3>No tokens</H3>
					)}
					<Button onPress={() => dismiss()}>
						<Text>Close</Text>
					</Button>
				</BottomSheetView>
			</BottomSheetContent>
		</BottomSheet>
	);
}

export const TokenItem = ({
	item,
	receiverAddr,
}: { item: any; receiverAddr?: string }) => {
	const balAmt =
		parseInt(item.balance, 10) /
		Math.pow(10, item.decimals ? item.decimals : 6);
	const { dismiss } = useBottomSheetModal();

	return (
		<TouchableOpacity
			className="py-5"
			onPress={() => {
				dismiss();
			}}
		>
			<Link
				href={{
					pathname: "/(authenticated)/(modals)/send/step1",
					params: {
						tokenData: JSON.stringify({
							...item,
							formattedBalAmt: balAmt,
							originalBal: item.balance,
						}),
						receiverAddr: receiverAddr,
					},
				}}
				onPress={() => {
					console.log("dismiss");
					dismiss();
				}}

				// onPress={() => SheetManager.hide("select-token")}
			>
				<View className="flex justify-between flex-row items-end">
					<View className="flex gap-3 flex-row flex-1">
						<View>
							<Image
								source={item.image}
								// placeholder={{ blurhash }}
								contentFit="cover"
								style={{ height: 40, width: 40, borderRadius: 20 }}
								transition={1000}
							/>
						</View>
						<View className="flex flex-col justify-center gap-1">
							<Text className="uppercase font-semibold">{item.ticker}</Text>
							<Muted className="">{item.name}</Muted>
						</View>
					</View>
					<View className="flex flex-col items-end gap-3">
						<Text className="font-medium ">{balAmt.toLocaleString()}</Text>
						<View className="flex flex-row items-center gap-1">
							{item.currentPrice ? (
								<Small className="">
									{(balAmt * item.currentPrice).toFixed(4)} USD
								</Small>
							) : (
								<Small className="">N/A</Small>
							)}
						</View>
					</View>
				</View>
			</Link>
		</TouchableOpacity>
	);
};
