import { ArrowDown } from "~/lib/icons/ArrowDown";
import {
	BottomSheetOpenTrigger,
	BottomSheetContent,
	BottomSheet,
	BottomSheetView,
} from "./ui/bottom-sheet.native";
import { Pressable, View } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";

import React, { memo, lazy, Suspense } from "react";
import { StyleSheet } from "react-native";
import CopyButton from "./ui/Copy";
import { Skeleton } from "./ui/skeleton";
import { Muted, H3, Small } from "./ui/typography";
import { Text } from "./ui/text";
import { dismiss } from "expo-router/build/global-state/routing";
import { Send } from "lucide-react-native";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Button } from "./ui/button";

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
		<View className="px-6">
			{bns && <Text className="text-white font-medium">{bns}</Text>}
			<View className="flex items-center gap-2 flex-row">
				<Muted>{stxAddr}</Muted>
				<CopyButton copyText={stxAddr} />
			</View>
		</View>
	),
);

const Header = memo(() => (
	<View>
		<H3 className="text-center text-white mb-2">Stacks address</H3>
		<Muted className="text-center">
			Only use this address to receive SIP-10 tokens.
		</Muted>
	</View>
));

function ReceiveSheet({ stxAddr, bns }: { stxAddr: string; bns: string }) {
	const { dismiss } = useBottomSheetModal();
	const snapPoints = ["90%"];
	return (
		<BottomSheet className="flex-1">
			<BottomSheetOpenTrigger asChild className="flex-1 w-full">
				<Pressable className="flex flex-col w-full flex-1 rounded-md max-h-none bg-muted items-center justify-center gap-3 py-3">
					<ArrowDown className="text-primary" strokeWidth={1.25} />
					<Small className="mx-auto text-center">Receive</Small>
				</Pressable>
			</BottomSheetOpenTrigger>

			<BottomSheetContent>
				<BottomSheetView className="">
					<View className="flex flex-col gap-6">
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
				</BottomSheetView>
			</BottomSheetContent>
		</BottomSheet>
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
