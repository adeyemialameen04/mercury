import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import NetworkFeeSheet from "~/app/(authenticated)/(tabs)/send/NewtworkFeeSheet";
import AmountSheet from "~/components/send/AmountSheet";
import ConfirmTxSheet from "~/components/send/ConfirmTxSheet";
import SelectToken from "~/components/send/SelectToken";
import ImportWalletSheet from "~/components/wallet/ImportWalletSheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";
import { AccountBalance } from "~/types/balance";
import { TokenData } from "~/types/token";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter);
registerSheet("import-wallet-sheet", ImportWalletSheet);
registerSheet("select-token", SelectToken);
registerSheet("amount-sheet", AmountSheet);
registerSheet("network-fee", NetworkFeeSheet);
registerSheet("confirm-tx-sheet", ConfirmTxSheet);

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
		"network-fee": SheetDefinition;
		"confirm-tx-sheet": SheetDefinition<{
			routes: {
				"confirm-tx-route": RouteDefinition<{
					payload: {
						tokenData: TokenData;
						buyParams: any;
					};
				}>;
				"tx-success-route": RouteDefinition<{
					txID: string;
				}>;
			};
		}>;
	}
}

export {};
