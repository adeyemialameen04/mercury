import { View } from "react-native";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { H4 } from "../ui/typography";
import { Wallet } from "~/lib/icons/Wallet";
import { Button } from "../ui/button";
import { Maximize2 } from "~/lib/icons/Maximize2";
import { useState, useCallback, useEffect, useMemo } from "react";
import { StxCityTokenInfo } from "~/types/token";
import { AccountBalance } from "~/types/balance";
import { getBuyableTokens, getSellableTokens } from "~/lib/stacks/stxcity";
import { WalletData } from "~/types/wallet";
import ActionButton from "../ActionButton";
import {
	contractPrincipalCV,
	uintCV,
	Pc,
	broadcastTransaction,
	makeContractCall,
} from "@stacks/transactions";

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

const STX_PRICE_OPTIONS: PriceOptionType[] = [
	{ value: "10", display: "10" },
	{ value: "50", display: "50" },
	{ value: "100", display: "100" },
	{ value: "300", display: "300" },
];

const MAX_PRICE = "1000";
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

const MaxButton = ({ onPress }: { onPress: () => void }) => (
	<Button className="flex-1" variant="secondary" onPress={onPress}>
		<Maximize2 className="text-primary" strokeWidth={1.25} size={18} />
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
	const [stxPrice, setStxPrice] = useState("0.00001");
	const [slippage, setSlippage] = useState(INITIAL_SLIPPAGE);
	const [sellableAmount, setSellableAmount] = useState("0");
	const [isLoading, setIsLoading] = useState(false);
	const matchingKey = Object.keys(balance.fungible_tokens).find((key) =>
		key.startsWith(token.token_contract),
	);
	const tokenBalance = balance.fungible_tokens[matchingKey].balance;

	const dexContract = useMemo(
		() => token.dex_contract.split("."),
		[token.dex_contract],
	);
	const tokenContract = useMemo(
		() => token.token_contract.split("."),
		[token.dex_contract],
	);

	const calculateReceivableStx = useCallback(
		async (amountStr: string) => {
			if (!amountStr || isNaN(Number(amountStr))) return;

			setIsLoading(true);
			try {
				const amountNum = Number.parseFloat(amountStr);
				const amount = Math.floor(amountNum * 10 ** 6);

				const receivableStx = await getSellableTokens(
					dexContract,
					walletData.address,
					amount,
				);
				console.log(JSON.stringify(receivableStx, null, 2));

				if (receivableStx) {
					const buyableTokenAmount =
						receivableStx?.type === "ok"
							? receivableStx.value.value["buyable-token"].value
							: 0n;

					const readableValue =
						Number(buyableTokenAmount) / 10 ** token.decimals;
					setSellableAmount(readableValue.toFixed(4));
				}
			} catch (error) {
				console.error("Error calculating buyable tokens:", error);
				console.log(JSON.stringify(error, null, 2));
				setSellableAmount("0");
			} finally {
				setIsLoading(false);
			}
		},
		[dexContract, walletData.address, token.decimals],
	);

	// Debounced effect for calculating buyable tokens
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (stxPrice) {
				calculateReceivableStx(stxPrice);
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timeoutId);
	}, [stxPrice, calculateReceivableStx]);

	const handlePriceChange = useCallback((value: string) => {
		if (value === "" || DECIMAL_REGEX.test(value)) {
			setStxPrice(value);
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
			console.log("Buy clicked", {
				amount: stxPrice,
				slippage,
				expectedTokens: sellableAmount,
			});
			console.log("0: Starting transaction");

			const uintCvAmount = Number.parseFloat(stxPrice) * 10 ** 6;
			console.log("1: Calculated amount", uintCvAmount);

			// Convert buyableAmount to the proper format for post conditions
			const buyableAmountForPostCondition = BigInt(
				Math.floor(Number(sellableAmount) * 10 ** token.decimals),
			);

			console.log("Contract details:", {
				contractAddress: dexContract[0],
				contractName: dexContract[1],
				tokenContract: `${tokenContract[0]}.${tokenContract[1]}`,
				address: walletData.address,
				buyableAmountForPostCondition: buyableAmountForPostCondition.toString(),
			});

			const functionArgs = [
				contractPrincipalCV(tokenContract[0], tokenContract[1]),
				uintCV(uintCvAmount),
			];
			console.log("1.5: Created function args");

			const postConditions = [
				Pc.principal(walletData.address).willSendEq(uintCvAmount).ustx(),
				Pc.principal(dexContract[0] + "." + dexContract[1])
					.willSendGte(buyableAmountForPostCondition)
					.ft(`${tokenContract[0]}.${tokenContract[1]}`, token.symbol),
			];
			console.log("1.8: Created post conditions");

			const txOptions = {
				contractAddress: dexContract[0],
				contractName: dexContract[1],
				functionName: "buy",
				functionArgs,
				postConditions,
				validateWithAbi: true,
				senderKey: walletData.stxPrivateKey,
			};
			console.log("1.9: Created transaction options");

			const tx = await makeContractCall(txOptions);
			console.log("2: Contract call created");

			const res = await broadcastTransaction({
				transaction: tx,
				network: "mainnet",
			});
			console.log("3: Transaction broadcast", res);
		} catch (err) {
			console.error("Error in handleBuy:", err);
			if (err instanceof Error) {
				console.error("Error message:", err.message);
				console.error("Error stack:", err.stack);
			}
		} finally {
			setIsLoading(false);
		}
	}, [
		stxPrice,
		slippage,
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
		[isLoading, sellableAmount, token.symbol],
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
					value={stxPrice}
					onChangeText={handlePriceChange}
					keyboardType="numeric"
				/>
			</View>

			<View className="flex-1 justify-center items-center gap-3 flex flex-row">
				{STX_PRICE_OPTIONS.map((option) => (
					<PriceOption
						key={option.value}
						option={option}
						onPress={() => setStxPrice(option.value)}
					/>
				))}
				{/* <MaxButton onPress={() => setStxPrice(MAX_PRICE)} /> */}
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
				disabled={isLoading || !stxPrice || Number(stxPrice) <= 0}
				text={isLoading ? "Calculating..." : "Sell"}
				loading={isLoading}
			/>
		</TabsContent>
	);
}
