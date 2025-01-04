import { useQuery } from "react-query";
import { Progress } from "~/components/ui/progress";
import { CircleDollarSign } from "~/lib/icons/CircleDollarSign";
import { TrendingUp } from "~/lib/icons/TrendingUp";
import { getTokenMetadataFromSTXCity } from "~/queries/token";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Text } from "../ui/text";
import { memo, useState } from "react";
import { H4, Muted } from "../ui/typography";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { StxCityTokenData, StxCityTokenInfo } from "~/types/token";
import StxCityBuy from "./StxCityBuy";
import StxCitySell from "./StxCitySell";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { LucideIcon } from "lucide-react-native";
import { Button } from "../ui/button";
import { truncateContract } from "~/utils/truncate";
import { setStringAsync } from "expo-clipboard";
import TokenCardSkeleton from "../loading/TokenCardSkeleton";

const ItemStat = ({
	icon: Icon,
	title,
	val,
}: {
	icon: LucideIcon;
	title: string;
	val: number;
}) => {
	return (
		<View className="flex flex-col gap-0 flex-1">
			<View className="flex flex-row items-center gap-1">
				<Icon className="text-primary" strokeWidth={1.25} />
				<Text>{title}</Text>
			</View>
			<Text className="text-lg font-light">${val.toLocaleString()}</Text>
		</View>
	);
};

export default function StxCityTab({ contractID }: { contractID: string }) {
	const [activeTab, setActiveTab] = useState("buy");
	const { data, isLoading } = useQuery<StxCityTokenData>({
		queryKey: [`token-stxcity-${contractID}`],
		queryFn: async () => {
			if (!contractID) {
				throw new Error("Contract ID is needed");
			}
			return await getTokenMetadataFromSTXCity(contractID);
		},
		enabled: !!contractID,
	});
	const token = data?.bonding_curve[0];

	return (
		<TabsContent value="stx-city" className="mt-5">
			{isLoading ? (
				<TokenCardSkeleton />
			) : token ? (
				<Card className="">
					<TokenDetails token={token} />
					{token.progress !== 100 && (
						<CardFooter className="">
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="flex-1"
							>
								<TabsList className="flex-row w-full gap-4">
									<TabsTrigger value="buy" className="flex-1">
										<Text>Buy</Text>
									</TabsTrigger>
									<TabsTrigger value="sell" className="flex-1">
										<Text className="text-destructive">Sell</Text>
									</TabsTrigger>
								</TabsList>
								<StxCityBuy />
								<StxCitySell />
							</Tabs>
						</CardFooter>
					)}
				</Card>
			) : (
				<Text>This token was not listed on stx.city</Text>
			)}
		</TabsContent>
	);
}

const TokenDetails = memo(({ token }: { token: StxCityTokenInfo }) => {
	return (
		<>
			<CardHeader className="">
				<View className="flex flex-row gap-4 items-center">
					<Image
						source={token.logo_url}
						style={{ height: 50, width: 50, borderRadius: 25 }}
					/>
					<View className="flex flex-col">
						<H4 className="font-semibold uppercase">{token.name}</H4>
						<View className="flex flex-col">
							<Text className="font-medium">Ticker: {token.symbol}</Text>
							<Text className="font-medium">
								Supply: {token.supply.toLocaleString()}
							</Text>
						</View>
					</View>
				</View>
				<Muted>{token.description}</Muted>
				<View className="flex flex-col gap-1">
					<Text>Hello</Text>
					<Text className="text-sm">
						<Text className="text-green-400">
							{Math.ceil(token.progress)}% {"   "}
						</Text>
						{(token.progress / 100) * token.target_stx} of{" "}
						{token.target_stx.toLocaleString()} STX
					</Text>
					<Progress max={100} value={token.progress} />
				</View>
			</CardHeader>
			<CardContent className="">
				<Collapsible>
					<CollapsibleTrigger asChild>
						<Button variant={"secondary"}>
							<Text>Read More</Text>
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="flex flex-col gap-2 mt-3">
						<View className="flex flex-col gap-4 items-start my-3">
							<TouchableOpacity
								className=""
								onPress={async () => setStringAsync(token.token_contract)}
							>
								<Text>
									Token Contract: {truncateContract(token.token_contract)}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className=""
								onPress={async () => setStringAsync(token.dex_contract)}
							>
								<Text>
									Dex Contract: {truncateContract(token.dex_contract)}
								</Text>
							</TouchableOpacity>
						</View>
						<View className="flex flex-row gap-4 justify-between">
							<ItemStat
								icon={TrendingUp}
								title="Market Capital"
								val={token.stx_paid * token.supply}
							/>
							<ItemStat
								icon={CircleDollarSign}
								title="Price"
								val={token.stx_paid}
							/>
						</View>
						<View className="flex flex-row gap-4 justify-between">
							<ItemStat
								icon={TrendingUp}
								title="Volume"
								val={token.trading_volume}
							/>
							<ItemStat
								icon={TrendingUp}
								title="Market Capital"
								val={token.trading_volume}
							/>
						</View>
						{/* <View className=""></View> */}
					</CollapsibleContent>
				</Collapsible>
			</CardContent>
		</>
	);
});
