import {
	BottomSheetOpenTrigger,
	BottomSheetContent,
	BottomSheet,
	BottomSheetView,
	BottomSheetHeader,
	BottomSheetTextInput,
	BottomSheetFlashList,
} from "../ui/bottom-sheet.native";
import { Pressable, View } from "react-native";
import { H3, H4, Lead } from "../ui/typography";
import { Text } from "../ui/text";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { memo, useCallback, useMemo, useState } from "react";
import useDebounce from "~/hooks/useDebounce";

interface Token {
	name: string;
	symbol: string;
	imageUrl: string;
}

interface SelectTokenProps {
	sheetRef: any;
	tokens: Token[];
}

export function FromSelectToken({ sheetRef, tokens }: SelectTokenProps) {
	const { dismiss } = useBottomSheetModal();
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");
	const [isSheetReady, setIsSheetReady] = React.useState(false);

	// Memoize snap points to prevent unnecessary re-renders
	const snapPoints = useMemo(() => ["75%", "90%"], []);

	// Memoize filtered tokens
	const filteredTokens = useMemo(() => {
		if (!debouncedValue.trim()) return tokens;
		const query = debouncedValue.toLowerCase();
		return tokens?.filter(
			(token) =>
				token.name.toLowerCase().includes(query) ||
				token.symbol.toLowerCase().includes(query),
		);
	}, [tokens, debouncedValue]);

	const handleAnimationEnd = useCallback(() => {
		setIsSheetReady(true);
	}, []);

	const handleDismiss = useCallback(() => {
		setIsSheetReady(false);
	}, []);

	const renderItem = useCallback(
		({ item }: { item: Token }) => (
			<TokenItem
				token={item}
				onSelect={() => {
					dismiss();
				}}
			/>
		),
		[dismiss],
	);

	const getItemLayout = useCallback(
		(_: any, index: number) => ({
			length: 72,
			offset: 72 * index,
			index,
		}),
		[],
	);

	const keyExtractor = useCallback(
		(item: any) => `${item?.symbol}-${item?.name}`,
		[],
	);

	const debounced = () => {
		setDebouncedValue(searchQuery);
	};

	const [isReady, cancel] = useDebounce(debounced, 1000, [searchQuery]);

	return (
		<BottomSheet>
			<BottomSheetOpenTrigger asChild>
				<Pressable className="flex-row items-center bg-[#333333] rounded-full p-2 mb-2">
					<View className="w-6 h-6 bg-orange-500 rounded-full mr-2" />
					<Text className="text-white mr-1">STX</Text>
					<Text className="text-gray-400">▼</Text>
				</Pressable>
			</BottomSheetOpenTrigger>
			<BottomSheetContent
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				onAnimate={handleAnimationEnd}
				onDismiss={handleDismiss}
			>
				<BottomSheetView style={{ flex: 1 }}>
					<BottomSheetHeader className="py-2">
						<H4>Select A Token</H4>
					</BottomSheetHeader>
					<BottomSheetTextInput
						placeholder="Search name or paste token"
						className="my-3 bg-gray-100 rounded"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{Array.isArray(filteredTokens) ? (
						<BottomSheetFlashList
							data={filteredTokens}
							renderItem={renderItem}
							showsVerticalScrollIndicator={true}
							getItemLayout={getItemLayout}
							keyExtractor={keyExtractor}
							estimatedItemSize={filteredTokens.length}
							enableDynamicSizing={true}
							removeClippedSubviews={true}
							maxToRenderPerBatch={5}
							updateCellsBatchingPeriod={50}
							windowSize={5}
							initialNumToRender={8}
							onEndReachedThreshold={0.5}
						/>
					) : (
						<View className="p-4">
							<Text className="text-center text-gray-500">
								Loading tokens...
							</Text>
						</View>
					)}
				</BottomSheetView>
			</BottomSheetContent>
		</BottomSheet>
	);
}

interface TokenItemProps {
	token: Token;
	onSelect: () => void;
}

const TokenItem = memo(
	({ token, onSelect }: TokenItemProps) => {
		// Memoize the onPress callback
		const handlePress = useCallback(() => {
			onSelect();
		}, [onSelect]);

		// Memoize styles for better performance
		const imageStyle = useMemo(
			() => ({
				height: 40,
				width: 40,
				borderRadius: 20,
			}),
			[],
		);

		return (
			<Pressable
				className="flex flex-row items-center justify-between py-3"
				onPress={handlePress}
			>
				<View className="flex flex-row items-center gap-2">
					<Image
						source={token.imageUrl}
						contentFit="cover"
						style={imageStyle}
						transition={1000}
						cachePolicy="memory-disk" // Add caching for images
					/>
					<View className="flex flex-col">
						<H3>{token.name}</H3>
						<Lead>{token.symbol}</Lead>
					</View>
				</View>
			</Pressable>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison for memo
		return (
			prevProps.token.symbol === nextProps.token.symbol &&
			prevProps.token.name === nextProps.token.name &&
			prevProps.token.imageUrl === nextProps.token.imageUrl
		);
	},
);
