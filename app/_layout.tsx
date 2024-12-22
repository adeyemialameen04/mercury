import "~/global.css";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import "~/lib/sheets";
import { SheetProvider } from "react-native-actions-sheet";
import { useWalletData, WalletDataProvider } from "~/context/WalletDataContext";
import { useRouter } from "expo-router";
const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};
export { ErrorBoundary } from "expo-router";
SplashScreen.preventAutoHideAsync();
// Create a separate component for the main app content
function AppContent() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const { isWalletConnected } = useWalletData();
	const router = useRouter();
	const segments = useSegments();

	// Separate effect for theme loading
	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
				setAndroidNavigationBar(colorTheme);
			} else {
				setAndroidNavigationBar(colorTheme);
			}
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, []);

	// Separate effect for navigation, with proper dependencies and mounted check
	React.useEffect(() => {
		if (!isColorSchemeLoaded) return; // Wait for initial loading to complete

		const inAuthGroup = segments[0] === "(authenticated)";

		// Use setTimeout to ensure navigation happens after layout
		setTimeout(() => {
			if (isWalletConnected && !inAuthGroup) {
				router.replace("/(authenticated)/(tabs)/home");
			} else if (!isWalletConnected) {
				router.replace("/");
			}
		}, 0);
	}, [isWalletConnected, segments, isColorSchemeLoaded]);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<SheetProvider>
				<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
				<Stack>
					<Stack.Screen
						name="index"
						options={{
							title: "Mercury",
							headerShown: false,
						}}
					/>
					{/* Add screens for authenticated routes */}
					<Stack.Screen
						name="(authenticated)/(tabs)"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</SheetProvider>
			<PortalHost />
		</ThemeProvider>
	);
}
export default function RootLayout() {
	return (
		<WalletDataProvider>
			<AppContent />
		</WalletDataProvider>
	);
}
