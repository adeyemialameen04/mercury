import { View } from "react-native";
import { ArrowDown } from "~/lib/icons/ArrowDown";
import { Repeat } from "~/lib/icons/Repeat";
import { Send } from "~/lib/icons/Send";
import { Small } from "../ui/typography";
import { Pressable } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { AccountBalance } from "~/types/balance";
import { useRouter } from "expo-router";
import { TokenData } from "~/types/token";

const homeActions = [
	{
		title: "Send",
		route: "send",
		icon: Send,
	},
	{
		title: "Receive",
		route: "receive",
		icon: ArrowDown,
	},

	{
		title: "Swap",
		route: "swap",
		icon: Repeat,
	},
];

export default function HomeActions({
	from,
	tokenData,
	mergedTokens,
	isLoading,
}: {
	balance?: AccountBalance;
	from: string;
	tokenData: TokenData;
	mergedTokens?: any;
	isLoading: boolean;
}) {
	const router = useRouter();
	return (
		<View className="flex flex-row gap-4 items-center justify-center my-4">
			{homeActions.map((item) => (
				<Pressable
					className="flex flex-col flex-1 rounded-md max-h-none bg-muted items-center justify-center gap-3 py-3"
					key={item.route}
					onPress={async () => {
						if (item.route === "send") {
							console.log(1);
							if (from === "list" && tokenData) {
								console.log(2);
								router.push({
									pathname: "/(authenticated)/(tabs)/send/[contract]",
									params: {
										contract: tokenData.contract,
										tokenData: JSON.stringify({
											...tokenData,
										}),
									},
								});
							} else {
								await SheetManager.show("select-token", {
									payload: { mergedTokens, isLoading },
								});
							}
						}
					}}
				>
					{<item.icon className="text-primary" strokeWidth={1.25} />}
					<Small className="mx-auto text-center">{item.title}</Small>
				</Pressable>
			))}
		</View>
	);
}
