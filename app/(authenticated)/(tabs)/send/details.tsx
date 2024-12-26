import React from "react";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import { useRouter } from "expo-router";
import { Large, Muted } from "~/components/ui/typography";
import { TokenData } from "~/types/token";
import { Text } from "~/components/ui/text";
import HomeActions from "~/components/home/HomeActions";

export default function Page() {
	const { tokenData: tokenDataStr } = useLocalSearchParams();
	const tokenData: TokenData = JSON.parse(tokenDataStr as string);
	console.log(tokenData);
	const router = useRouter();

	return (
		<ScrollView className="flex-1 p-6 py-8">
			<Card className="w-full border-transparent">
				<CardHeader className="items-center space-y-4">
					<Image
						source={tokenData?.image}
						contentFit="cover"
						style={{ height: 50, width: 50, borderRadius: 25 }}
						transition={1000}
					/>
					<Muted className="font-semibold">{tokenData?.name}</Muted>
					<Large>
						{tokenData.formattedBalAmt} {tokenData.ticker}
					</Large>
					<Text>{tokenData.currentPrice * tokenData.formattedBalAmt} USD</Text>
					<HomeActions from="list" tokenData={tokenData} />
				</CardHeader>
				<CardContent className="flex flex-col gap-4"></CardContent>
				<CardFooter></CardFooter>
			</Card>
		</ScrollView>
	);
}
