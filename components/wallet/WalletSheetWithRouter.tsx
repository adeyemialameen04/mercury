import { usePathname } from "expo-router";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GenerateWalletRoute } from "./GenerateWalletRoute";
import { Route } from "react-native-actions-sheet";
import WalletGeneratedRoute from "./WalletGeneratedRoute";

const routes: Route[] = [
	{
		name: "generate-wallet",
		component: GenerateWalletRoute,
	},
	{ name: "wallet-generated-route", component: WalletGeneratedRoute },
];

export function WalletSheetWithRouter(props: SheetProps) {
	const insets = useSafeAreaInsets();
	const pathname = usePathname();

	return (
		<ActionSheet
			routes={routes}
			id={props.sheetId}
			initialRoute={
				pathname === "/" ? "generate-wallet" : "wallet-generated-route"
			}
			// useBottomSafeAreaPadding
			// safeAreaInsets={insets}
			isModal={false}
			closable={pathname === "/settings" ? true : false}
			{...props}
		/>
	);
}
