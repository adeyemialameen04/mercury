import { RouteDefinition } from "react-native-actions-sheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ReceiveSheet from "~/components/home/ReceiveSheet";
import ConfirmTxSheet from "~/components/send/ConfirmTxSheet";
import SelectToken from "~/components/send/SelectToken";
import ImportWalletSheet from "~/components/wallet/ImportWalletSheet";
import { WalletSheetWithRouter } from "~/components/wallet/WalletSheetWithRouter";
import { TokenData } from "~/types/token";
import { WalletData } from "~/types/wallet";

registerSheet("wallet-sheet-with-router", WalletSheetWithRouter, "global");
registerSheet("import-wallet-sheet", ImportWalletSheet, "global");
registerSheet("select-token", SelectToken, "global");
registerSheet("confirm-tx-sheet", ConfirmTxSheet, "global");
registerSheet("receive-sheet", ReceiveSheet, "global");

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
		"receive-sheet": SheetDefinition<{
			payload: {
				stxAddr: string;
				bns: string | null;
			};
		}>;
		"import-wallet-sheet": SheetDefinition;
		"select-token": SheetDefinition<{
			payload: {
				mergedTokens: any;
				isLoading: boolean;
				receiverAddr?: string;
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
					walletData: WalletData;
				}>;
			};
		}>;
	}
}

export {};
