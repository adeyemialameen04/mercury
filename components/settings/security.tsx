import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "../ui/collapsible";
import { Lead } from "../ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { Link } from "expo-router";
import ActionButton from "../ActionButton";
import { useWalletStore } from "~/store/walletStore";
import { SheetManager } from "react-native-actions-sheet";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export const Security = () => {
	const { isDarkColorScheme } = useColorScheme();
	const [checked, setChecked] = useState(false);
	const { deleteWallet } = useWalletStore();
	return (
		<Collapsible className="gap-3" defaultOpen>
			<CollapsibleTrigger className="flex items-center flex-row justify-between">
				<Lead>Security</Lead>
				<ChevronRight className="text-primary" size={22} />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<Card>
					<CardContent className="mt-5">
						<Button
							onPress={() => {
								SheetManager.show("wallet-sheet-with-router", {
									context: "global",
								});
							}}
							variant={"secondary"}
						>
							<Text>Copy Seedphrases</Text>
						</Button>
						<ActionButton
							onPress={async () => deleteWallet()}
							loading={false}
							text="Reset Wallet"
							variant={"ghost"}
							className="mt-3"
							textClassname="text-destructive"
						/>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
};
