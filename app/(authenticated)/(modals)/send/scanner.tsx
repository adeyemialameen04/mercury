import { validateStacksAddress } from "@stacks/transactions";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Overlay } from "~/components/Overlay";
import { useWalletBalance } from "~/hooks/useWalletBalance";
import { useWalletStore } from "~/store/walletStore";

export default function Page() {
	const { walletData } = useWalletStore();
	const { balanceData, isLoading, error, refetch, mergedTokens } =
		useWalletBalance(walletData);

	return (
		<SafeAreaView style={StyleSheet.absoluteFillObject}>
			{Platform.OS === "android" ? <StatusBar hidden /> : null}
			<Overlay />
			<CameraView
				style={StyleSheet.absoluteFillObject}
				facing="back"
				onBarcodeScanned={async ({ data }) => {
					const isValidStxAddr = validateStacksAddress(data);
					if (isValidStxAddr) {
						await SheetManager.show("select-token", {
							payload: { mergedTokens, isLoading, receiverAddr: data },
							context: "global",
						});
					}
				}}
			/>
		</SafeAreaView>
	);
}
