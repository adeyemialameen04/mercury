import { View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { SheetProps } from "react-native-actions-sheet";
import { Muted } from "~/components/ui/typography";
import { Bike } from "~/lib/icons/Bike";
import { Rocket } from "~/lib/icons/Rocket";
import { Car } from "~/lib/icons/Car";

const fees = [
	{
		title: "High Priority",
		icon: Rocket,
		price: 0.000445,
	},
];

export default function NetworkFeeSheet(props: SheetProps<"network-fee">) {
	return (
		<ActionSheet id={props.sheetId}>
			<View className="p-6">
				<Muted>
					Apply a higher fee to help your transaction confirm quickly,
					especially when the network is congested
				</Muted>
				<View className="flex flex-col gap-4"></View>
			</View>
		</ActionSheet>
	);
}
