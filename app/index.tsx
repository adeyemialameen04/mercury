import { Link } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";
import { H2 } from "~/components/ui/typography";

export default function Screen() {
	const [checked, setChecked] = useState(false);
	const [showWalletOptions, setShowWalletOptions] = useState(false);

	const handleContinue = () => {
		setShowWalletOptions(true);
	};

	return (
		<SafeAreaView className="flex-1">
			<ScrollView className="flex-1">
				<View className="flex-1 gap-6 p-6">
					<H2 className="text-center"> Welcome to Mercury</H2>
					<Text className="text-base text-center mb-4">
						Mercury is the fastest trading bot on the Stacks chain. Execute
						trades instantly, set up automations like Limit Orders, DCA,
						Copy-trading and Sniping with unmatched speed and reliability.
					</Text>
					{!showWalletOptions && (
						<View>
							<Text className="text-sm text-muted-foreground text-center mb-6">
								By continuing, you'll create a crypto wallet that connects with
								Mercury to enable instant swaps and real-time data.
							</Text>
							<View className="flex-row items-center justify-center mb-6">
								<Checkbox
									checked={checked}
									onCheckedChange={setChecked}
									className="mr-2"
								/>
								<Text className="text-sm text-muted-foreground flex-shrink">
									I accept the{" "}
									<Link href={"/terms"}>
										<Text className="text-primary font-medium">
											Terms of Use
										</Text>
									</Link>{" "}
									and{" "}
									<Link href={"/privacy"}>
										<Text className="text-primary font-medium">
											Privacy Policy
										</Text>
									</Link>
								</Text>
							</View>
							<Button
								onPress={handleContinue}
								disabled={!checked}
								className="w-full py-4"
							>
								<Text className="font-semibold">Continue</Text>
							</Button>
						</View>
					)}

					{/* {showWalletOptions && <WalletOptions />} */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
