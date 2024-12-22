import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ImportWalletSheet from "~/components/wallet/ImportWalletSheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter);
registerSheet("import-wallet-sheet", ImportWalletSheet);

declare module "react-native-actions-sheet" {
	interface Sheets {
		"wallet-sheet-with-router": SheetDefinition<{
			routes: {
				"generate-wallet": RouteDefinition;
				"wallet-generated-route": RouteDefinition<{
					payload: {
						phrases: string;
					};
				}>;
			};
		}>;
		"import-wallet-sheet": SheetDefinition;
	}
}

export {};
