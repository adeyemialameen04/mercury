import { Stack } from "expo-router";
import { SheetProvider } from "react-native-actions-sheet";

export default function ModalsLayout() {
	return (
		<SheetProvider context="modal">
			<Stack>
				<Stack.Screen name="send/step1" options={{ headerShown: false }} />
				<Stack.Screen name="send/step2" options={{ headerShown: false }} />
			</Stack>
		</SheetProvider>
	);
}
