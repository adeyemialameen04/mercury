import { View } from "react-native";
import { Text } from "../ui/text";

export default function RecentTransactions() {
	return (
		<View className="flex flex-col gap-4 p-4 bg-muted roundex-lg my-4">
			<Text>TX's</Text>
		</View>
	);
}
