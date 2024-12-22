import { usePathname } from "expo-router";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GenerateWalletRoute } from "./GenerateWalletRoute";
import { Route } from "react-native-actions-sheet";

const routes: Route[] = [
	{
		name: "generate-wallet",
		component: GenerateWalletRoute,
	},
	// {
	// 	name: "seed-phrases",
	// 	component: SeedPhrases,
	// },
];

export function WalletSheetWithRouter(props: SheetProps) {
	const insets = useSafeAreaInsets();
	const pathname = usePathname();

	return (
		<ActionSheet
			routes={routes}
			id={props.sheetId}
			initialRoute={
				pathname === "/settings" ? "seed-phrases" : "generate-wallet"
			}
			useBottomSafeAreaPadding
			safeAreaInsets={insets}
			closable={pathname === "/settings" ? true : false}
			{...props}
		/>
	);
}
