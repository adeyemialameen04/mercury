import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter);

declare module "react-native-actions-sheet" {
	interface Sheets {
		"wallet-sheet-with-router": SheetDefinition<{
			routes: {
				"generate-wallet": RouteDefinition;
				"seed-phrases": RouteDefinition<{
					payload: {
						phrases: string;
					};
				}>;
			};
		}>;
	}
}

export {};
