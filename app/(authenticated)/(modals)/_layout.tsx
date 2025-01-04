import { Stack } from "expo-router";
import { SheetProvider } from "react-native-actions-sheet";

export default function ModalsLayout() {
	return (
		<SheetProvider context="modal">
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="send/step1" />
				<Stack.Screen name="send/step2" />
				<Stack.Screen name="send/scanner" />
			</Stack>
		</SheetProvider>
	);
}
