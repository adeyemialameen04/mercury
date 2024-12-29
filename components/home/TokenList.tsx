import { Image } from "expo-image";
import { View, Text } from "react-native";
import { Muted, Small } from "../ui/typography";
import React from "react";
import { TokenItemSkeleton } from "../loading/TokenItemSkeleton";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function TokenList({
	isLoading,
	mergedTokens,
}: {
	isLoading: boolean;
	mergedTokens: any;
}) {
	return (
		<View className="flex flex-col gap-6 mt-4">
			{isLoading ? (
				<View className="flex flex-col gap-4">
					<TokenItemSkeleton />
					<TokenItemSkeleton />
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
	);
}

export const TokenItem = ({ item }: { item: any }) => {
	const balAmt =
		parseInt(item.balance, 10) /
		Math.pow(10, item.decimals ? item.decimals : 6);

	return (
		<TouchableOpacity className="">
			<Link
				href={{
					pathname: "/(authenticated)/(tabs)/[contract]",
					params: {
						contract: item.contract,
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
							<Text className="uppercase font-semibold text-primary">
								{item.ticker}
							</Text>
							<Muted className="">{item.name}</Muted>
						</View>
					</View>
					<View className="flex flex-col items-end gap-3">
						<Text className="font-medium text-primary">
							{balAmt.toLocaleString()}
						</Text>
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
