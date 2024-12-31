import React, { useState, useCallback } from "react";
import { ArrowUpDown } from "~/lib/icons/ArrowUpDown";
import { View } from "react-native";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
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
import {
	broadcastTransaction,
	fetchAbi,
	makeContractCall,
	PostConditionMode,
	SignedContractCallOptions,
} from "@stacks/transactions";
import { transformPostConditions } from "~/lib/services/postConditions";
import { transformFunctionArgs } from "~/lib/services/functionArgs";

const sdk = new VelarSDK();

const VelarSwapInterface = ({ walletData }: { walletData: WalletData }) => {
	// State for input values
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");

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

	const handleSwapConfirm = useCallback(async () => {
		setIsLoading(true);
		// @ts-ignore
		const { VELAR, STX } = await getTokens();
		const account = walletData.address.trim();
		console.log(account);
		const swapInstance: ISwapService = await sdk.getSwapInstance({
			account: account,
			inToken: STX,
			outToken: VELAR,
		});

		const amount: AmountOutResponse = await swapInstance.getComputedAmount({
			type: SwapType.ONE,
			amount: 1,
		});
		console.log(amount);

		const swapOptions: SwapResponse = await swapInstance.swap({
			amount: 1,
			type: SwapType.ONE,
		});
		console.log(swapOptions);
		const postConditions = transformPostConditions(swapOptions.postConditions);
		const funcArgs = transformFunctionArgs(swapOptions);
		console.log(funcArgs, "transformFunctionArgs");

		const options: SignedContractCallOptions = {
			...swapOptions,
			network: "mainnet",
			validateWithAbi: true,
			// functionArgs: funcArgs,
			senderKey: walletData.address,
			postConditionMode: PostConditionMode.Deny,
			postConditions,
		};

		const abi = await fetchAbi({
			contractAddress: swapOptions.contractAddress,
			contractName: swapOptions.contractName,
			network: "mainnet",
		});
		console.log(abi);

		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				console.log("promising");
				const tx = await makeContractCall(options);
				console.log(2);

				const res = await broadcastTransaction({
					transaction: tx,
					network: "mainnet",
				});
				console.log(3);

				console.log(res);
				resolve(res);
			}, 0);
		});
	}, [fromAmount, toAmount]);

	return (
		<Card className="">
			{/* Header */}
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
						<View className="flex-row items-center bg-[#333333] rounded-full p-2 mb-2">
							<View className="w-6 h-6 bg-orange-500 rounded-full mr-2" />
							<Text className="text-white mr-1">STX</Text>
							<Text className="text-gray-400">▼</Text>
						</View>
					</View>
					<Input
						className="flex-1"
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
						className="flex-1"
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
