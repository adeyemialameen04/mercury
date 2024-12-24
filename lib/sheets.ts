import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import { FormData } from "~/app/(authenticated)/(tabs)/send/[contract]";
import AmountSheet from "~/components/send/AmountSheet";
import SelectToken from "~/components/send/SelectToken";
import ImportWalletSheet from "~/components/wallet/ImportWalletSheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";
import { AccountBalance } from "~/types/balance";
import { FtMetadataResponse } from "~/types/metadata";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter);
registerSheet("import-wallet-sheet", ImportWalletSheet);
registerSheet("select-token", SelectToken);
registerSheet("amount-sheet", AmountSheet);

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
		"amount-sheet": SheetDefinition<{
			payload: {
				buyParams: FormData;
				token: FtMetadataResponse;
				balance: string;
			};
		}>;
	}
}

export {};
