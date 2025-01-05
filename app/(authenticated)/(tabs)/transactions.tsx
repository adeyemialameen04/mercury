import { useState } from "react";
import { SafeAreaView } from "react-native";
import MemPool from "~/components/transactions/MemPool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

export default function Screen() {
	const [activeTab, setActiveTab] = useState("mempool");
	return (
		<SafeAreaView className="p-6">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
			>
				<TabsList className="flex-row w-full">
					<TabsTrigger value="mempool" className="flex-1">
						<Text>MemPool</Text>
					</TabsTrigger>
					<TabsTrigger value="wallet" className="flex-1">
						<Text>Wallet</Text>
					</TabsTrigger>
				</TabsList>
				<TabsContent className="" value="mempool">
					<MemPool />
				</TabsContent>
			</Tabs>
		</SafeAreaView>
	);
}
