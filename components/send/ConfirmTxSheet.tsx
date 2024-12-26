import ActionSheet, { Route, SheetProps } from "react-native-actions-sheet";
import ConfirmTxRoute from "./ConfirmTxRoute";
import TxSuccessRoute from "./TXSuccessRoute";

const routes: Route[] = [
	{
		name: "confirm-tx-route",
		component: ConfirmTxRoute,
	},
	{
		name: "tx-success-route",
		component: TxSuccessRoute,
	},
];

export default function ConfirmTxSheet(props: SheetProps) {
	console.log(props.payload);

	return (
		<ActionSheet
			routes={routes}
			enableRouterBackNavigation={true}
			initialRoute={"confirm-tx-route"}
			closable={false}
			containerStyle={{
				backgroundColor: "#27282A",
			}}
			{...props}
		/>
	);
}
