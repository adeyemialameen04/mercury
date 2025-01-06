import { View } from "react-native";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { H4 } from "../ui/typography";
import { Wallet } from "~/lib/icons/Wallet";
import { Button } from "../ui/button";
import { useState, useCallback, useEffect, useMemo } from "react";
import { StxCityTokenInfo } from "~/types/token";
import { AccountBalance } from "~/types/balance";
import { getSellableTokens } from "~/lib/stacks/stxcity";
import { WalletData } from "~/types/wallet";
import ActionButton from "../ActionButton";
import {
	contractPrincipalCV,
	uintCV,
	Pc,
	broadcastTransaction,
	makeContractCall,
	SignedContractCallOptions,
} from "@stacks/transactions";
import { StxCityTransactionBroadcastedSheet } from "./StxCityTransactionBroadcastedSheet";
import { useBottomSheet } from "../ui/bottom-sheet.native";

interface StxCitySellProps {
	token: StxCityTokenInfo;
	balance: AccountBalance;
	walletData: WalletData;
}

interface PriceOptionType {
	value: string;
	display: string;
}

const INITIAL_SLIPPAGE = "0.5";

const PERCENTAGE_OPTIONS: PriceOptionType[] = [
	{ value: "25", display: "25%" },
	{ value: "50", display: "50%" },
	{ value: "75", display: "75%" },
	{ value: "100", display: "100%" },
];

const DECIMAL_REGEX = /^\d*\.?\d*$/;
const SLIPPAGE_REGEX = /^\d*\.?\d{0,2}$/;

const PriceOption = ({
	option,
	onPress,
}: {
	option: PriceOptionType;
	onPress: () => void;
}) => (
	<Button className="flex-1" variant="secondary" onPress={onPress}>
		<Text>{option.display}</Text>
	</Button>
);

const BalanceDisplay = ({
	balance,
	decimals,
	symbol,
}: { balance: number | undefined; decimals: number; symbol: string }) => {
	const formattedBalance = useMemo(() => {
		if (!balance) return "0";
		return (balance / 10 ** decimals).toFixed(4);
	}, [balance]);

	return (
		<View className="flex items-center gap-1 flex-row">
			<Wallet className="text-primary" strokeWidth={1.25} size={14} />
			<Text>{`${formattedBalance} ${symbol}`}</Text>
		</View>
	);
};

export default function StxCitySell({
	token,
	balance,
	walletData,
}: StxCitySellProps) {
	const [tokenAmount, setTokenAmount] = useState("5");
	const { open, ref } = useBottomSheet();
	const [txID, setTxID] = useState("");
	const [slippage, setSlippage] = useState(INITIAL_SLIPPAGE);
	const [sellableAmount, setSellableAmount] = useState("0");
	const [isLoading, setIsLoading] = useState(false);

	const matchingKey = Object.keys(balance.fungible_tokens).find((key) =>
		key.startsWith(token.token_contract),
	);
	const tokenBalance = balance.fungible_tokens[matchingKey].balance;
	const formattedTokenBalance = useMemo(
		() => (tokenBalance ? Number(tokenBalance) / 10 ** token.decimals : 0),
		[tokenBalance, token.decimals],
	);

	const dexContract = useMemo(
		() => token.dex_contract.split("."),
		[token.dex_contract],
	);
	const tokenContract = useMemo(
		() => token.token_contract.split("."),
		[token.dex_contract],
	);

	const handlePercentageSelect = useCallback(
		(percentage: string) => {
			const amount = (
				(Number(percentage) / 100) *
				formattedTokenBalance
			).toFixed(4);
			setTokenAmount(amount);
		},
		[formattedTokenBalance],
	);

	const calculateReceivableStx = useCallback(
		async (amountStr: string) => {
			if (!amountStr || isNaN(Number(amountStr))) return;

			setIsLoading(true);
			try {
				const amountNum = Number.parseFloat(amountStr);
				const amount = Math.floor(amountNum * 10 ** 6);

				if (isNaN(amountNum) || amountNum <= 0) {
					setSellableAmount("0");
					return;
				}

				// Check if amount exceeds 0.002 (moved after valid number check)
				// if (amountNum >= 0.002) {
				// 	setSellableAmount("0");
				// 	return;
				// }

				// Convert amount to contract format before calling
				// const contractAmount = (amountNum * 10 ** (token.decimals || 6)).toString();

				const response = await getSellableTokens(
					dexContract,
					walletData.address,
					amount,
				);

				if (!response) {
					throw new Error("Failed to fetch sellable tokens");
				}

				if (
					response.type === "ok" &&
					response.value?.value?.["receivable-stx"]?.value
				) {
					const receivableStx = BigInt(
						response.value.value["receivable-stx"].value,
					);
					const readableValue = Number(receivableStx) / 10 ** 6;
					setSellableAmount(readableValue.toFixed(4));
				} else {
					throw new Error("Invalid response format from contract");
				}
			} catch (error) {
				console.error("Error calculating sellable tokens:", error);
				setSellableAmount("0");
			} finally {
				setIsLoading(false);
			}
		},
		[dexContract, walletData.address],
	);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (tokenAmount) {
				calculateReceivableStx(tokenAmount);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [tokenAmount, calculateReceivableStx]);

	const handlePriceChange = useCallback((value: string) => {
		if (value === "" || DECIMAL_REGEX.test(value)) {
			setTokenAmount(value);
		}
	}, []);

	const handleSlippageChange = useCallback((value: string) => {
		if (value === "" || SLIPPAGE_REGEX.test(value)) {
			setSlippage(value);
		}
	}, []);

	const handleSell = useCallback(async () => {
		setIsLoading(true);
		try {
			const uintCvAmount = Number.parseFloat(tokenAmount) * 10 ** 6;
			const decimals = token.decimals ? token.decimals : 6;
			const expectedStxUintCv = BigInt(
				Math.floor(Number(sellableAmount) * 10 ** decimals),
			);

			const functionArgs = [
				contractPrincipalCV(tokenContract[0], tokenContract[1]),
				uintCV(uintCvAmount),
			];

			const postConditions = [
				Pc.principal(dexContract[0] + "." + dexContract[1])
					.willSendGte(expectedStxUintCv)
					.ustx(),
				Pc.principal(walletData.address)
					.willSendEq(uintCvAmount)
					.ft(`${tokenContract[0]}.${tokenContract[1]}`, token.symbol),
			];

			const txOptions: SignedContractCallOptions = {
				contractAddress: dexContract[0],
				contractName: dexContract[1],
				functionName: "sell",
				functionArgs,
				postConditions,
				validateWithAbi: true,
				senderKey: walletData.stxPrivateKey,
			};

			const tx = await makeContractCall(txOptions);
			const res = await broadcastTransaction({
				transaction: tx,
				network: "mainnet",
			});
			setTxID(res.txid);
			console.log("3: Transaction broadcast", res);
			open();
		} catch (err) {
			console.error("Error in handleSell:", err);
		} finally {
			setIsLoading(false);
		}
	}, [
		tokenAmount,
		sellableAmount,
		dexContract,
		tokenContract,
		walletData,
		token.symbol,
		token.decimals,
	]);

	const receiveText = useMemo(
		() =>
			isLoading ? "Calculating..." : `Would receive min ${sellableAmount} STX`,
		[isLoading, sellableAmount],
	);

	return (
		<TabsContent value="sell" className="mt-4 gap-3">
			<View className="flex justify-between items-center flex-row">
				<View className="flex flex-col gap-2 flex-1">
					<View className="flex flex-row items-center gap-2">
						<Image
							style={{ height: 20, width: 20, borderRadius: 10 }}
							source={token.logo_url}
						/>
						<H4>{token.symbol}</H4>
					</View>
					<BalanceDisplay
						balance={Number(tokenBalance)}
						decimals={token.decimals}
						symbol={token.symbol}
					/>
				</View>
				<Input
					placeholder="0"
					className="flex-1"
					value={tokenAmount}
					onChangeText={handlePriceChange}
					keyboardType="numeric"
				/>
			</View>
			<View className="flex-1 justify-center items-center gap-3 flex flex-row">
				{PERCENTAGE_OPTIONS.map((option) => (
					<PriceOption
						key={option.value}
						option={option}
						onPress={() => handlePercentageSelect(option.value)}
					/>
				))}
			</View>
			<View className="flex justify-between items-center flex-row">
				<H4 className="flex-1">Slippage (%)</H4>
				<Input
					placeholder={INITIAL_SLIPPAGE}
					className="flex-1"
					value={slippage}
					onChangeText={handleSlippageChange}
					keyboardType="numeric"
				/>
			</View>
			<View>
				<Text>{receiveText}</Text>
			</View>
			<ActionButton
				onPress={handleSell}
				disabled={isLoading || !tokenAmount || Number(tokenAmount) <= 0}
				text={isLoading ? "Calculating..." : "Sell"}
				loading={isLoading}
			/>
			<StxCityTransactionBroadcastedSheet
				sheetRef={ref}
				txID={txID}
				walletData={walletData}
			/>
		</TabsContent>
	);
}
