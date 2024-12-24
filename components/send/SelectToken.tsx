import axios from "axios";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { XVERSE_API_BASE_URL } from "~/lib/constants";
import { useWalletStore } from "~/store/walletStore";
import { Muted, Small } from "../ui/typography";
import { useQuery } from "react-query";
import React from "react";
import { TokenItemSkeleton } from "../loading/TokenItemSkeleton";
import { TouchableOpacity } from "react-native";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const getTokens = async (coins: string[]) => {
	try {
		console.log(coins);
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
	const { walletData } = useWalletStore();
	const balance = props.payload?.balance;

	const tokenIDS = Object.keys(balance?.fungible_tokens || {}).map(
		(key) => key.split("::")[0],
	);

	const { isLoading, data: tokens } = useQuery(
		[`tokens-${walletData?.address}`],
		() => (tokenIDS.length > 0 ? getTokens(tokenIDS) : null),
		{
			enabled: !!tokenIDS,
		},
	);

	const mergedTokens = tokens?.map((token) => {
		const matchingKey = Object.keys(balance?.fungible_tokens || {}).find(
			(key) => key.startsWith(token.contract),
		);

		if (matchingKey) {
			const tokenBalance = balance?.fungible_tokens[matchingKey].balance;
			return { ...token, balance: tokenBalance };
		}

		return token;
	});

	return (
		<ActionSheet id={props.sheetId}>
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

const TokenItem = ({ item }: { item: any }) => {
	const balAmt = parseInt(item.balance, 10) / Math.pow(10, item.decimals);

	return (
		<TouchableOpacity className="p-6">
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
						<Text className="uppercase font-semibold">{item.ticker}</Text>
						<Muted>{item.name}</Muted>
					</View>
				</View>
				<View className="flex flex-col items-end gap-3">
					<Text className="font-medium">{balAmt.toLocaleString()}</Text>
					<View className="flex flex-row items-center gap-1">
						{item.currentPrice ? (
							<Small>{balAmt * item.currentPrice} USD</Small>
						) : (
							<Small>N/A</Small>
						)}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};
