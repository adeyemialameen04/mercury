import { View } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { Text } from "../ui/text";
import { H3, Muted } from "../ui/typography";
import React from "react";
import { StyleSheet } from "react-native";
import CopyButton from "../ui/Copy";

export default function ReceiveSheet(props: SheetProps<"receive-sheet">) {
	const stxAddr = props.payload?.stxAddr;
	const bns = props.payload?.bns;

	return (
		<ActionSheet
			id={props.sheetId}
			containerStyle={{
				backgroundColor: "#27282A",
			}}
		>
			<View className="p-6 flex flex-col gap-6">
				<View>
					<H3 className="text-center text-white mb-2">Stacks address</H3>
					<Muted className="text-center">
						Only use this address to receive SIP-10 tokens.
					</Muted>
				</View>
				<View className="self-center">
					<QRCodeStyled
						data={stxAddr}
						style={styles.svg}
						padding={20}
						pieceSize={8}
						pieceBorderRadius={4}
						gradient={{
							type: "radial",
							options: {
								center: [0.5, 0.5],
								radius: [1, 1],
								colors: ["#fc6432", "#000"],
								locations: [0, 1],
							},
						}}
						outerEyesOptions={{
							topLeft: {
								borderRadius: [20, 20, 0, 20],
							},
							topRight: {
								borderRadius: [20, 20, 20],
							},
							bottomLeft: {
								borderRadius: [20, 0, 20, 20],
							},
						}}
						innerEyesOptions={{
							borderRadius: 12,
							scale: 0.85,
						}}
						logo={{
							href: require("../../assets/images/stacks-logo.png"),
							padding: 4,
							scale: 0.8,
						}}
						// value={stxAddr}
						// logo={{ uri: STACKS_LOGO }}
					/>
				</View>
				<View>
					{bns && <Text className="text-white font-medium">{bns}</Text>}
					<View className="flex items-center gap-2 flex-row">
						<Muted>{stxAddr}</Muted>
						<CopyButton copyText={stxAddr as string} />
					</View>
				</View>
			</View>
		</ActionSheet>
	);
}

const styles = StyleSheet.create({
	svg: {
		backgroundColor: "white",
		borderRadius: 36,
		overflow: "hidden",
	},
});
