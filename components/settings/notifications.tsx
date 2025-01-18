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
import ActionButton from "../ActionButton";
import { Switch } from "../ui/switch";
import axios from "axios";
import { API_BASE_URL } from "~/lib/constants";
import { useNotification } from "~/context/NotificationContext";
import { useWalletStore } from "~/store/walletStore";
import { FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export const Notifications = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState(false);
	const { expoPushToken } = useNotification();
	const { walletData } = useWalletStore();

	return (
		<Collapsible className="gap-3" defaultOpen>
			<CollapsibleTrigger className="flex items-center flex-row justify-between">
				<Lead>Notification Preferences</Lead>
				<ChevronRight className="text-primary" size={22} />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<Card>
					<CardContent className="mt-5 flex flex-col gap-3">
						<View className="flex-row items-center gap-2">
							<Switch
								checked={checked}
								onCheckedChange={setChecked}
								nativeID="new-token-notifications"
							/>
							<Label
								nativeID="new-token-notifications"
								onPress={() => {
									setChecked((prev) => !prev);
								}}
							>
								Sniping Tokens
							</Label>
						</View>
						{/* <View className="flex-row items-center gap-2 flex-1"> */}
						{/* 	<Label>Hiro Platform Api Key</Label> */}
						{/* 	<Input placeholder="6129df35-d048-4948-8151-e381c23ae8ee" /> */}
						{/* </View> */}
						<ActionButton
							loading={isLoading}
							text="Save"
							variant={"secondary"}
							className=""
							onPress={async () => {
								setIsLoading(true);
								try {
									const { data } = await axios.post(
										`${API_BASE_URL}new-token`,
										{
											expoPushToken,
											address: walletData?.address,
										},
									);
									console.log(data);
								} catch (err) {
									console.log(err);
								} finally {
									setIsLoading(false);
								}
							}}
						/>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
};
