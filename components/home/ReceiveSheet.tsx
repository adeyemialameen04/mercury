import { View } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { Text } from "../ui/text";
import { H3, Muted } from "../ui/typography";
import React, { memo, lazy, Suspense } from "react";
import { StyleSheet } from "react-native";
import CopyButton from "../ui/Copy";
import { Skeleton } from "../ui/skeleton";

// Lazy load the QR code component
const LazyQRCode = lazy(() =>
	Promise.resolve({
		default: memo(({ stxAddr }: { stxAddr: string }) => (
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
					href: require("~/assets/images/stacks-logo.png"),
					padding: 4,
					scale: 0.9,
				}}
			/>
		)),
	}),
);

// Memoize the address display component
const AddressDisplay = memo(
	({ bns, stxAddr }: { bns?: string; stxAddr: string }) => (
		<View>
			{bns && <Text className="text-white font-medium">{bns}</Text>}
			<View className="flex items-center gap-2 flex-row">
				<Muted>{stxAddr}</Muted>
				<CopyButton copyText={stxAddr} />
			</View>
		</View>
	),
);

// Memoize the header component
const Header = memo(() => (
	<View>
		<H3 className="text-center text-white mb-2">Stacks address</H3>
		<Muted className="text-center">
			Only use this address to receive SIP-10 tokens.
		</Muted>
	</View>
));

function ReceiveSheet(props: SheetProps<"receive-sheet">) {
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
				<Header />
				<View className="self-center">
					<Suspense
						fallback={
							<Skeleton className="h-[250px] w-[250px] rounded-[36px]" />
						}
					>
						<LazyQRCode stxAddr={stxAddr as string} />
					</Suspense>
				</View>
				<AddressDisplay
					bns={bns as string | undefined}
					stxAddr={stxAddr as string}
				/>
			</View>
		</ActionSheet>
	);
}

const styles = StyleSheet.create({
	svg: {
		backgroundColor: "white",
		borderRadius: 36,
		overflow: "hidden",
		width: 250,
		height: 250,
	},
});

export default memo(ReceiveSheet);
