import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Card, CardContent } from "../ui/card";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "../ui/collapsible";
import { Label } from "../ui/label";
import { Lead } from "../ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { Switch } from "react-native-switch";
import { Link } from "expo-router";
import ActionButton from "../ActionButton";

export const Notifications = () => {
	const { isDarkColorScheme } = useColorScheme();
	const [checked, setChecked] = useState(false);
	return (
		<Link
			href={{
				pathname: `/settings/notifications`,
			}}
			asChild
		>
			<Collapsible className="gap-3" defaultOpen>
				<CollapsibleTrigger className="flex items-center flex-row justify-between">
					<Lead>Notification Preferences</Lead>
					<ChevronRight className="text-primary" size={22} />
				</CollapsibleTrigger>
				<CollapsibleContent>
					<Card>
						<CardContent className="mt-5">
							<View className="flex-row items-center gap-2">
								<Switch
									value={checked}
									onValueChange={() => setChecked(!checked)}
									renderActiveText={false}
									renderInActiveText={false}
									backgroundActive={isDarkColorScheme ? "white" : "#08080a"}
									circleSize={20}
								/>
								<Label
									nativeID="new-token-notifications"
									onPress={() => {
										setChecked((prev) => !prev);
									}}
								>
									New token notifications
								</Label>
							</View>
							<ActionButton
								loading={false}
								text="Save"
								variant={"secondary"}
								className="mt-3"
							/>
						</CardContent>
					</Card>
				</CollapsibleContent>
			</Collapsible>
		</Link>
	);
};
