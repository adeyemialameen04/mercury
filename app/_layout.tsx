import "~/global.css";
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
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import "~/lib/sheets";
import { SheetProvider } from "react-native-actions-sheet";
import { useRouter } from "expo-router";
import { useWalletStore } from "~/store/walletStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { NAV_THEME } from "~/lib/colors";
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
const queryClient = new QueryClient();

// Create a separate component for the main app content
function AppContent() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const { isWalletConnected } = useWalletStore();
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
			<QueryClientProvider client={queryClient}>
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
			</QueryClientProvider>
			<PortalHost />
		</ThemeProvider>
	);
}
export default function RootLayout() {
	return <AppContent />;
}
