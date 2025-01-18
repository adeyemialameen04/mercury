import React, { useState, useCallback } from "react";
import { ArrowUpDown } from "~/lib/icons/ArrowUpDown";
import { View } from "react-native";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Muted } from "../ui/typography";
import ActionButton from "../ActionButton";
import {
	AmountOutResponse,
	getTokens,
	ISwapService,
	SwapResponse,
	SwapType,
	VelarSDK,
} from "@velarprotocol/velar-sdk";
import { WalletData } from "~/types/wallet";
import { Input } from "../ui/input";
import { swapTokenVelar } from "~/queries/swap";
import { FromSelectToken } from "./FromToken";
import { useBottomSheet } from "../ui/bottom-sheet.native";
import { VELAR_API_BASE_URL } from "~/lib/constants";
import axios from "axios";
import { useQuery } from "react-query";

const sdk = new VelarSDK();

const getVelarTokens = async () => {
	try {
		const url = `${VELAR_API_BASE_URL}tokens`;
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		console.error(err);
	}
};

const VelarSwapInterface = ({ walletData }: { walletData: WalletData }) => {
	const { ref, open, close } = useBottomSheet();
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");
	const { isLoading: isTokensLoading, data: tokensData } = useQuery(
		["tokens"],
		async () => {
			return await getVelarTokens();
		},
	);

	// Token balances
	const [balances] = useState({
		STX: "200.99",
		VELAR: "0",
	});

	const exchangeRate = 28.992537;

	const [isLoading, setIsLoading] = useState(false);

	const handleFromAmountChange = useCallback(
		(value: string) => {
			setFromAmount(value);
			const numValue = parseFloat(value) || 0;
			setToAmount((numValue * exchangeRate).toFixed(6));
		},
		[exchangeRate],
	);

	const handleToAmountChange = useCallback(
		(value: string) => {
			setToAmount(value);
			const numValue = parseFloat(value) || 0;
			setFromAmount((numValue / exchangeRate).toFixed(6));
		},
		[exchangeRate],
	);

	const handleUseMax = useCallback(() => {
		handleFromAmountChange(balances.STX);
	}, [balances.STX, handleFromAmountChange]);

	const handleSwapDirection = useCallback(() => {
		const tempFromAmount = fromAmount;
		setFromAmount(toAmount);
		setToAmount(tempFromAmount);
	}, [fromAmount, toAmount]);

	const handleSwapConfirm = async () => {
		setIsLoading(true);
		console.log(1);
		// @ts-ignore
		const { VELAR, STX } = await getTokens();
		const swapInstance: ISwapService = await sdk.getSwapInstance({
			account: walletData.address as string,
			inToken: STX,
			outToken: VELAR,
		});
		console.log(2);

		const amount: AmountOutResponse = await swapInstance.getComputedAmount({
			type: SwapType.ONE,
			amount: 1,
		});
		console.log(amount);
		console.log(3);

		const swapOptions: SwapResponse = await swapInstance.swap({
			amount: 1,
			type: SwapType.ONE,
		});
		console.log(4);

		console.log(5);
		const serializedSwapOptions = JSON.parse(
			JSON.stringify(swapOptions, (key, value) =>
				typeof value === "bigint" ? value.toString() : value,
			),
		);

		const res = await swapTokenVelar(serializedSwapOptions, walletData);
		console.log(6);

		console.log(res);
		setIsLoading(false);
	};

	return (
		<Card className="">
			<CardHeader className="flex-row justify-between items-center">
				<Text className="text-white text-xl font-medium">Swap</Text>
				<View className="flex-row items-center">
					<Muted className="mr-2">Slippage: 4%</Muted>
					<Muted>Edit</Muted>
				</View>
			</CardHeader>
			<CardContent>
				<View className="rounded-lg mb-2">
					<View className="flex-row justify-between items-center gap-3">
						<Text className="flex-1">From</Text>
						<FromSelectToken sheetRef={ref} tokens={tokensData} />
						{/* <View className="flex-row items-center bg-[#333333] rounded-full p-2 mb-2"> */}
						{/* 	<View className="w-6 h-6 bg-orange-500 rounded-full mr-2" /> */}
						{/* 	<Text className="text-white mr-1">STX</Text> */}
						{/* 	<Text className="text-gray-400">▼</Text> */}
						{/* </View> */}
					</View>
					<Input
						className=""
						placeholder="0.00"
						value={fromAmount}
						onChangeText={handleFromAmountChange}
						keyboardType="numeric"
					/>
					<View className="flex-row justify-between mt-2">
						<Text className="text-gray-400">Balance</Text>
						<View className="flex-row">
							<Text className="text-gray-400 mr-2">{balances.STX}</Text>
							<Text className="text-orange-500" onPress={handleUseMax}>
								Use Max
							</Text>
						</View>
					</View>
				</View>
				{/* Swap Direction Button */}
				<View className="items-center -my-2 z-10">
					<Button variant="secondary" onPress={handleSwapDirection}>
						<ArrowUpDown strokeWidth={1.25} className="text-primary" />
					</Button>
				</View>
				{/* To Token Section */}
				<View className="mt-2">
					<View className="flex-row justify-between items-center gap-3 mb-2">
						<Text className="flex-1">To</Text>
						<View className="flex-row items-center bg-[#333333] rounded-full p-2">
							<View className="w-6 h-6 bg-gray-600 rounded-full mr-2" />
							<Text className="text-white mr-1">VELAR</Text>
							<Text className="text-gray-400">▼</Text>
						</View>
					</View>
					<Input
						className=""
						placeholder="0.00"
						value={toAmount}
						onChangeText={handleToAmountChange}
						keyboardType="numeric"
					/>
					<View className="flex-row justify-between mt-2">
						<Text className="text-gray-400">Balance</Text>
						<Text className="text-gray-400">{balances.VELAR}</Text>
					</View>
				</View>
			</CardContent>
			<CardFooter className="flex-col gap-4 flex">
				<ActionButton
					className="w-full"
					text="Confirm Swap"
					loading={isLoading}
					onPress={handleSwapConfirm}
				/>
			</CardFooter>
		</Card>
	);
};

export default VelarSwapInterface;
