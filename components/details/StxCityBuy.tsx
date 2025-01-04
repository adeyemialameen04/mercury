import { View } from "react-native";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { H4 } from "../ui/typography";
import { Wallet } from "~/lib/icons/Wallet";
import { Button } from "../ui/button";
import { Maximize2 } from "~/lib/icons/Maximize2";
import { useState } from "react";

export default function StxCityBuy() {
	const [stxPrice, setStxPrice] = useState("0");
	const stxPriceOptions = ["10", "50", "100", "300"];

	return (
		<TabsContent value="buy" className="mt-4 gap-3">
			<View className="flex justify-between items-center flex-row">
				<View className="flex flex-col gap-2 flex-1">
					<View className="flex flex-row items-center gap-2">
						<Image
							style={{ height: 20, width: 20, borderRadius: 10 }}
							source={require("~/assets/images/stacks-logo.png")}
						/>
						<H4>STX</H4>
					</View>
					<View className="flex items-center gap-1 flex-row">
						<Wallet className="text-primary" strokeWidth={1.25} size={14} />
						<Text>190 STX</Text>
					</View>
				</View>
				<Input
					placeholder="0"
					className="flex-1"
					value={stxPrice}
					onChange={(e) => setStxPrice(e.target.value)}
				/>
			</View>
			<View className="flex-1 justify-center items-center gap-3 flex flex-row">
				{stxPriceOptions.map((price, index) => (
					<Button
						className="flex-1"
						variant={"secondary"}
						onPress={() => setStxPrice(price)}
						key={price + index}
					>
						<Text>{price}</Text>
					</Button>
				))}
				<Button
					className="flex-1"
					variant={"secondary"}
					onPress={() => setStxPrice("1000")}
				>
					<Maximize2 className="text-primary" strokeWidth={1.25} size={18} />
				</Button>
			</View>
			<View className="flex justify-between items-center flex-row">
				<H4 className="flex-1">Slippage</H4>
				<Input placeholder="0" className="flex-1" />
			</View>
			<View>
				<Text>Would receive min 0000 CAPY</Text>
			</View>
			<Button>
				<Text>Buy</Text>
			</Button>
		</TabsContent>
	);
}
