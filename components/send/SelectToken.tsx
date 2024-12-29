import axios from "axios";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { XVERSE_API_BASE_URL } from "~/lib/constants";
import { useWalletStore } from "~/store/walletStore";
import { Muted, Small } from "../ui/typography";
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

	return (
		<ActionSheet
			id={props.sheetId}
			containerStyle={{
				backgroundColor: "#27282A",
			}}
		>
			<View className="flex flex-col gap-0">
				{isLoading ? (
					<View className="flex flex-col p-6 gap-4">
						<TokenItemSkeleton />
						<TokenItemSkeleton />
						<TokenItemSkeleton />
					</View>
				) : (
					mergedTokens?.map((token, index) => (
						<TokenItem key={`${token.id}-${index}`} item={token} />
					))
				)}
			</View>
		</ActionSheet>
	);
}

export const TokenItem = ({ item }: { item: any }) => {
	const balAmt =
		parseInt(item.balance, 10) /
		Math.pow(10, item.decimals ? item.decimals : 6);

	return (
		<TouchableOpacity className="p-6">
			<Link
				href={{
					pathname: "/(authenticated)/(modals)/send/step1",
					params: {
						tokenData: JSON.stringify({
							...item,
							formattedBalAmt: balAmt,
							originalBal: item.balance,
						}),
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
