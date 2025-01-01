import { View } from "react-native";
import { Notifications } from "~/components/settings/notifications";
import { Security } from "~/components/settings/security";

const settings = [
	{
		title: "Notification Preferences",
		route: "notifications",
	},
];

export default function Page() {
	return (
		<View className="p-6">
			<View className="flex flex-col gap-4">
				<Notifications />
				<Security />
			</View>
		</View>
	);
}
