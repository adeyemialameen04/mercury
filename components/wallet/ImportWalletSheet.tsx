import React, { useRef } from "react";
import { View } from "react-native";
import ActionSheet, {
	SheetManager,
	SheetProps,
} from "react-native-actions-sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { H4, Muted } from "../ui/typography";
import { getAddressFromPrivateKey } from "@stacks/transactions";
import { Wallet, generateWallet } from "@stacks/wallet-sdk";
import Animated from "react-native-reanimated";
import { useRotationAnimation } from "~/hooks/useRotation";
import { Loader } from "~/lib/icons/Loader";
import { useWalletStore } from "~/store/walletStore";

export default function ImportWalletSheet(
	props: SheetProps<"import-wallet-sheet">,
) {
	const rotationAnimation = useRotationAnimation();
	const { setWalletData } = useWalletStore();
	const [isImporting, setIsImporting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const inputRefs = useRef<Array<any>>(Array(24).fill(null));
	const [phrases, setPhrases] = React.useState<string[]>(
		"utility still afford spoil orange kite trouble surprise stock call coil review cup offer one destroy cloud guide coin blouse eagle hurt april desk".split(
			" ",
		),
	);
	// const [phrases, setPhrases] = React.useState<string[]>(Array(24).fill(""));

	const handleInputChange = (text: string, index: number) => {
		const newPhrases = [...phrases];
		newPhrases[index] = text;
		setPhrases(newPhrases);
		if (error) setError(null);
	};

	const handleKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === "Enter") {
			if (index === 23 && phrases[23].trim()) {
				handleSubmit();
			} else if (index < 23) {
				inputRefs.current[index + 1]?.focus();
			}
		} else if (e.key === "Backspace" && phrases[index] === "" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async () => {
		const emptyFields = phrases.reduce((acc, phrase, index) => {
			if (!phrase.trim()) {
				acc.push(index + 1);
			}
			return acc;
		}, [] as number[]);

		if (emptyFields.length > 0) {
			setError(
				`Please fill in word${emptyFields.length > 1 ? "s" : ""} ${emptyFields.join(", ")}`,
			);
			inputRefs.current[emptyFields[0] - 1]?.focus();
			return;
		}

		setIsImporting(true);
		try {
			const seedPhrase = phrases.join(" ");
			const wallet: Wallet = await generateWallet({
				secretKey: seedPhrase,
				password: "",
			});
			const account1 = wallet.accounts[0];
			await setWalletData({
				address: getAddressFromPrivateKey(account1.stxPrivateKey),
				stxPrivateKey: account1.stxPrivateKey,
				mnemonic: seedPhrase,
			});
			await SheetManager.hide("import-wallet-sheet");
		} catch (err) {
			setError("Invalid seed phrase. Please check your words and try again.");
		} finally {
			setIsImporting(false);
		}
	};

	const renderInputRows = () => {
		const rows = [];
		for (let i = 0; i < 6; i++) {
			const rowInputs = [];
			for (let j = 0; j < 4; j++) {
				const inputIndex = i * 4 + j;
				rowInputs.push(
					<View key={`input-${inputIndex}`} className="flex-1">
						<Text className="text-xs text-gray-500 mb-1 ml-1">
							{inputIndex + 1}
						</Text>
						<Input
							ref={(el) => (inputRefs.current[inputIndex] = el)}
							value={phrases[inputIndex]}
							onChangeText={(text) => {
								handleInputChange(text, inputIndex);
								if (
									text === "" &&
									phrases[inputIndex] === "" &&
									inputIndex > 0
								) {
									inputRefs.current[inputIndex - 1]?.focus();
								}
							}}
							onKeyPress={(e) => handleKeyPress(e, inputIndex)}
							placeholder={`Word ${inputIndex + 1}`}
							className={`mx-1 ${!phrases[inputIndex].trim() && error ? "border-red-500" : ""}`}
							aria-label={`Phrase word ${inputIndex + 1}`}
							returnKeyType={inputIndex === 23 ? "done" : "next"}
							onSubmitEditing={() => {
								if (inputIndex === 23 && phrases[23].trim()) {
									handleSubmit();
								} else if (inputIndex < 23) {
									inputRefs.current[inputIndex + 1]?.focus();
								}
							}}
							blurOnSubmit={inputIndex === 23}
						/>
					</View>,
				);
			}
			rows.push(
				<View key={`row-${i}`} className="flex-row gap-2 mb-4">
					{rowInputs}
				</View>,
			);
		}
		return rows;
	};

	return (
		<ActionSheet {...props} closable={false}>
			<View className="flex flex-col p-6">
				<View className="flex flex-col mb-4">
					<H4 className="dark:text-black">Import Wallet</H4>
					<Muted className="">
						Enter your 24-word recovery phrase to import your wallet.
					</Muted>
				</View>
				{renderInputRows()}
				{error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}
				<View className="flex flex-row gap-3 w-full mt-2">
					<Button
						variant="outline"
						className="flex-1"
						disabled={isImporting}
						onPress={() => {
							SheetManager.hide("import-wallet-sheet");
						}}
					>
						<Text>Cancel</Text>
					</Button>
					<Button
						onPress={handleSubmit}
						className="gap-3 items-center flex-row flex-1"
						disabled={isImporting}
					>
						{isImporting ? (
							<Animated.View style={rotationAnimation}>
								<Loader
									className="text-foreground"
									size={18}
									strokeWidth={1.25}
								/>
							</Animated.View>
						) : null}
						<Text className="">
							{isImporting ? "Importing..." : "Import Wallet"}
						</Text>
					</Button>
				</View>
			</View>
		</ActionSheet>
	);
}
