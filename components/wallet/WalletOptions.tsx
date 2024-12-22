import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Badge } from "../ui/badge";
import { SheetManager } from "react-native-actions-sheet";

export default function WalletOptions() {
	return (
		<View className="flex-1">
			<Text className="text-sm text-muted-foreground text-center mb-6 font-semibold">
				By continuing, you'll create a crypto wallet that connects with Mercury
				to enable instant swaps and real-time data.
			</Text>
			<View className="flex gap-4 flex-row w-full">
				<Button
					className="flex-1 relative"
					onPress={() => {
						SheetManager.show("wallet-sheet-with-router");
					}}
				>
					<Text className="font-semibold">Generate Wallet</Text>
					<Badge className="absolute -right-2 -top-3 bg-primary">
						<Text className="text-xs">Suggested</Text>
					</Badge>
				</Button>

				<Button
					variant="secondary"
					className="flex-1"
					onPress={() => {
						SheetManager.show("import-wallet-sheet");
					}}
				>
					<Text className="font-semibold">Import Wallet</Text>
				</Button>
			</View>
		</View>
	);
}
