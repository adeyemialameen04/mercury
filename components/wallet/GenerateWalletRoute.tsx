import React, { useState } from "react";
import { View } from "react-native";
import { RouteScreenProps } from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Muted } from "~/components/ui/typography";
import { Check } from "~/lib/icons/Check";
import { v4 as uuidv4 } from "uuid";
import { generateNewWallet } from "~/lib/services/wallet";
import ActionButton from "../ActionButton";
import { getAddressFromPrivateKey } from "@stacks/transactions";
import { useWalletStore } from "~/store/walletStore";

export function GenerateWalletRoute({
	router,
}: RouteScreenProps<"wallet-sheet-with-router", "generate-wallet">) {
	const { setWalletData } = useWalletStore();
	const [isGenerating, setIsGenerating] = useState(false);
	const tips = [
		{ id: 1, text: "Make sure no one can see your screen" },
		{ id: 2, text: "Have a pen and paper ready to write it down" },
		{ id: 3, text: "Never share these words with anyone" },
		{ id: 4, text: "Store them in a secure location" },
	];

	return (
		<View className="flex fle-col gap-4 p-6">
			<Text className="dark:text-black">
				You are about to view your wallet's recovery phrase. This is a series of
				words that gives complete access to your wallet.
			</Text>
			<View className="flex flex-col gap-2">
				{tips.map((tip) => (
					<View key={tip.id} className="flex flex-row items-center gap-2">
						<Check size={17} className="text-green-500" />
						<Muted className="">{tip.text}</Muted>
					</View>
				))}
				<View className="flex flex-row gap-3 w-full mt-2">
					<Button
						variant="outline"
						className="flex-1"
						disabled={isGenerating}
						onPress={() => {
							router.close();
						}}
					>
						<Text>Cancel</Text>
					</Button>
					<ActionButton
						text={isGenerating ? "Generating ..." : "Generate Wallet"}
						loading={isGenerating}
						onPress={async () => {
							setIsGenerating(true);
							try {
								const shortUUID = uuidv4();
								const { wallet, mnemonic } = await generateNewWallet(
									shortUUID.split("-")[0],
									"mainnet",
								);
								await setWalletData({
									stxPrivateKey: wallet.accounts[0].stxPrivateKey,
									address: getAddressFromPrivateKey(
										wallet.accounts[0].stxPrivateKey,
									),
									mnemonic,
								});
								setIsGenerating(false);
								router.navigate("wallet-generated-route", {
									payload: { phrases: mnemonic },
								});
							} catch (err) {
								console.error(err);
							}
						}}
					/>
				</View>
			</View>
		</View>
	);
}
