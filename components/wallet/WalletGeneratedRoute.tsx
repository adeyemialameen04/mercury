import React, { useState } from "react";
import { View } from "react-native";
import {
	RouteScreenProps,
	useSheetRouteParams,
} from "react-native-actions-sheet";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Muted } from "~/components/ui/typography";
import { CheckCircle } from "~/lib/icons/CheckCircle";
import { Eye } from "~/lib/icons/Eye";
import { EyeOff } from "~/lib/icons/EyeOff";
import { Copy } from "~/lib/icons/Copy";
import * as Clipboard from "expo-clipboard";
import { cn } from "~/lib/utils";
import { useWalletStore } from "~/store/walletStore";

export default function WalletGeneratedRoute({
	router,
}: RouteScreenProps<"wallet-sheet-with-router", "wallet-generated-route">) {
	const { walletData } = useWalletStore();
	const [isHidden, setIsHidden] = useState(false);
	const [copied, setCopied] = useState(false);
	const params = useSheetRouteParams("generate-wallet-sheet", "seed-phrases");
	const phrases = walletData?.mnemonic;
	// const phrases = params.payload.phrases;

	const toggleVisibility = () => setIsHidden(!isHidden);

	const copyToClipboard = async () => {
		if (phrases) {
			await Clipboard.setStringAsync(phrases);
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		}
	};

	return (
		<View className="flex flex-col gap-6 p-6">
			<View className="flex flex-col gap-3">
				<Text className="dark:text-black">Your Recovery Phrase</Text>
				<Muted>
					Write down these 12 words in order and store them safely. Never share
					them with anyone.
				</Muted>
			</View>
			<View className="flex flex-col gap-4">
				<View className="flex flex-row justify-between items-center">
					<Button
						variant="outline"
						size="sm"
						onPress={toggleVisibility}
						className="flex flex-row items-center gap-2"
					>
						{isHidden ? (
							<Eye size={16} className="text-primary" strokeWidth={1.25} />
						) : (
							<EyeOff size={16} className="text-primary" strokeWidth={1.25} />
						)}
						<Text className="text-xs font-light">
							{isHidden ? "Show" : "Hide"} Recovery Phrase
						</Text>
					</Button>
					<Button
						variant="outline"
						size="sm"
						onPress={copyToClipboard}
						className="flex flex-row items-center gap-2"
					>
						{copied ? (
							<CheckCircle
								size={16}
								className="text-primary"
								strokeWidth={1.25}
							/>
						) : (
							<Copy size={16} className="text-primary" strokeWidth={1.25} />
						)}
						<Text className="text-xs">
							{copied ? "Copied!" : "Copy to Clipboard"}
						</Text>
					</Button>
				</View>
				<View className="flex flex-row flex-wrap gap-2 justify-between">
					{phrases &&
						phrases.split(" ").map((phrase, index) => (
							<View
								key={index}
								style={{ width: "30%" }}
								className={cn(
									"p-3 border rounded-lg flex flex-row items-center justify-between bg-background border-border",
									isHidden && "bg-muted",
								)}
							>
								<Text className="text-sm">{index + 1}.</Text>
								<Text className={cn("font-mono", isHidden && "blur-sm")}>
									{isHidden ? "****" : phrase}
								</Text>
							</View>
						))}
				</View>
			</View>
			<Button
				className="w-full mt-4"
				variant={"default"}
				onPress={() => {
					router.close();
				}}
			>
				<Text> I've Safely Stored My Phrase</Text>
			</Button>
		</View>
	);
}
