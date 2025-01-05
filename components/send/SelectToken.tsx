import axios from "axios";
import { FlashList } from "react-native-actions-sheet/dist/src/views/FlashList";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { XVERSE_API_BASE_URL } from "~/lib/constants";
import { useWalletStore } from "~/store/walletStore";
import { H3, Muted, Small } from "../ui/typography";
import React from "react";
import { TokenItemSkeleton } from "../loading/TokenItemSkeleton";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const getTokens = async (coins: string[]) => {
	try {
		const { data } = await axios.post(`${XVERSE_API_BASE_URL}sip10/tokens`, {
			currency: "USD",
			coins: JSON.stringify(coins),
		});
		return data;
	} catch (err) {
		console.error(err);
	}
};

export default function SelectToken(props: SheetProps<"select-token">) {
	const mergedTokens = props.payload?.mergedTokens;
	const isLoading = props.payload?.isLoading;
	const receiverAddr = props.payload?.receiverAddr;

	return (
		<ActionSheet
			id={props.sheetId}
			containerStyle={{
				backgroundColor: "#27282A",
			}}
		>
			{isLoading ? (
				<View className="flex flex-col gap-4">
					<TokenItemSkeleton />
					<TokenItemSkeleton />
					<TokenItemSkeleton />
					<TokenItemSkeleton />
					<TokenItemSkeleton />
				</View>
			) : mergedTokens && mergedTokens.length > 0 ? (
				mergedTokens?.map((token, index) => (
					<TokenItem
						key={`${token.id}-${index}`}
						item={token}
						receiverAddr={receiverAddr}
					/>
				))
			) : (
				<H3>No tokens</H3>
			)}
		</ActionSheet>
	);
}

export const TokenItem = ({
	item,
	receiverAddr,
}: { item: any; receiverAddr?: string }) => {
	const balAmt =
		parseInt(item.balance, 10) /
		Math.pow(10, item.decimals ? item.decimals : 6);

	return (
		<TouchableOpacity className="py-6">
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
				onPress={() => SheetManager.hide("select-token")}
			>
				<View className="flex justify-between flex-row items-end">
					<View className="flex gap-3 flex-row flex-1">
						<View>
							<Image
								source={item.image}
								placeholder={{ blurhash }}
								contentFit="cover"
								style={{ height: 40, width: 40, borderRadius: 20 }}
								transition={1000}
							/>
						</View>
						<View className="flex flex-col justify-center gap-1">
							<Text className="uppercase font-semibold text-white">
								{item.ticker}
							</Text>
							<Muted className="">{item.name}</Muted>
						</View>
					</View>
					<View className="flex flex-col items-end gap-3">
						<Text className="font-medium text-white">
							{balAmt.toLocaleString()}
						</Text>
						<View className="flex flex-row items-center gap-1">
							{item.currentPrice ? (
								<Small className="text-white">
									{(balAmt * item.currentPrice).toFixed(4)} USD
								</Small>
							) : (
								<Small className="text-white">N/A</Small>
							)}
						</View>
					</View>
				</View>
			</Link>
		</TouchableOpacity>
	);
};
