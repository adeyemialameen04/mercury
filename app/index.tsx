import { View, StyleSheet } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H4 } from "~/components/ui/typography";
import { SheetManager } from "react-native-actions-sheet";
import { Badge } from "~/components/ui/badge";
import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";

export default function Page() {
	return (
		<ImageBackground
			style={styles.imageBackground}
			source={require("~/assets/images/degen.png")}
		>
			<StatusBar hidden />
			<View className="mt-[80px] p-[20px]">
				<H4 className="text-white text-3xl uppercase font-black">
					Ready to change the way you degen?
				</H4>
			</View>
			<View className="flex items-center mb-[60px] px-[10px] flex-row gap-4 justify-center">
				<Button
					variant="secondary"
					className="flex-1 relative rounded-full"
					size={"lg"}
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
					className="flex-1 rounded-full"
					size={"lg"}
					onPress={() => {
						SheetManager.show("import-wallet-sheet");
					}}
				>
					<Text className="font-semibold">Import Wallet</Text>
				</Button>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	imageBackground: {
		width: "100%",
		height: "100%",
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
	},
});
