import { View } from "react-native";
import { ArrowDown } from "~/lib/icons/ArrowDown";
import { Repeat } from "~/lib/icons/Repeat";
import { Send } from "~/lib/icons/Send";
import { Small } from "../ui/typography";

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

export default function HomeActions() {
	return (
		<View className="flex flex-row gap-4 items-center justify-center my-4">
			{homeActions.map((item) => (
				<View
					className="flex flex-col flex-1 rounded-md max-h-none bg-muted items-center justify-center gap-3 py-3"
					key={item.route}
				>
					{<item.icon className="text-primary" strokeWidth={1.25} />}
					<Small className="mx-auto text-center">{item.title}</Small>
				</View>
			))}
		</View>
	);
}
