import { View } from "react-native";
import ActionButton from "~/components/ActionButton";
import { Text } from "~/components/ui/text";
import { useWalletStore } from "~/store/walletStore";

export default function Page() {
	const { deleteWallet } = useWalletStore();

	return (
		<View className="p-6">
			<Text>Settings</Text>
			<ActionButton
				onPress={async () => await deleteWallet()}
				loading={false}
				text="deleteWallet"
			/>
		</View>
	);
}
