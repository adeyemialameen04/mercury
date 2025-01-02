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
import { useWalletStore } from "~/store/walletStore";

export const Security = () => {
	const { isDarkColorScheme } = useColorScheme();
	const [checked, setChecked] = useState(false);
	const { deleteWallet } = useWalletStore();
	return (
		<Link
			href={{
				pathname: `/settings/notifications`,
			}}
			asChild
		>
			<Collapsible className="gap-3" defaultOpen>
				<CollapsibleTrigger className="flex items-center flex-row justify-between">
					<Lead>Security</Lead>
					<ChevronRight className="text-primary" size={22} />
				</CollapsibleTrigger>
				<CollapsibleContent>
					<Card>
						<CardContent className="mt-5">
							<ActionButton
								onPress={async () => deleteWallet()}
								loading={false}
								text="Reset Wallet"
								variant={"ghost"}
							/>
						</CardContent>
					</Card>
				</CollapsibleContent>
			</Collapsible>
		</Link>
	);
};
