import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import SelectToken from "~/components/send/SelectToken";
import ImportWalletSheet from "~/components/wallet/ImportWalletSheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";
import { AccountBalance } from "~/types/balance";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter);
registerSheet("import-wallet-sheet", ImportWalletSheet);
registerSheet("select-token", SelectToken);

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
		"select-token": SheetDefinition<{
			payload: {
				balance: AccountBalance;
			};
		}>;
	}
}

export {};
