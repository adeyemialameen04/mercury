import { ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SwapType, VelarSDK } from "@velarprotocol/velar-sdk";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Velar from "~/components/swap/velar";
import VelarSwapInterface from "~/components/swap/velar";
import { useWalletStore } from "~/store/walletStore";
import { WalletData } from "~/types/wallet";

const sdk = new VelarSDK();

const getPairs = async (symbol: string) => {
	return await sdk.getPairs("VELAR");
};

export default function Page() {
	const supportedSwaps = ["Velar", "Alex", "Bitflow"];
	const [activeTab, setActiveTab] = useState("velar");
	const { walletData } = useWalletStore();
	const [pairs, setPairs] = useState<any[]>([]); // Replace 'any' with your pairs type

	useEffect(() => {
		const fetchPairs = async () => {
			try {
				const fetchedPairs = await getPairs("VELAR");
				console.log(JSON.stringify(fetchedPairs, null, 2));

				setPairs(fetchedPairs);
			} catch (error) {
				console.error("Error fetching pairs:", error);
			}
		};

		fetchPairs();
	}, []);

	return (
		<SafeAreaProvider>
			<ScrollView className="p-6 flex-1">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-2">
					<TabsList className="flex-row w-full gap-3">
						{supportedSwaps.map((item) => (
							<TabsTrigger
								value={item.toLowerCase()}
								className="flex-1 capitalize"
								key={item}
							>
								<Text>{item}</Text>
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="velar">
						<VelarSwapInterface walletData={walletData as WalletData} />
					</TabsContent>
				</Tabs>
			</ScrollView>
		</SafeAreaProvider>
	);
}
