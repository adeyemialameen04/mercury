import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { Top } from "~/types/stxcity-mempool";
import { TxItem } from "./TxItem";
import { Card, CardHeader, CardTitle } from "../ui/card";

export default function PendingFunctionCallByFees({
	data,
	title = "Top 5 Pending Function Calls by Fee",
}: {
	data: Top[];
	title?: string;
}) {
	const renderItem = useCallback(({ item }) => <TxItem top={item} />, []);
	const ListHeaderComponent = useCallback(
		() => (
			<Card className="w-full mt-3">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			</Card>
		),
		[title],
	);

	return (
		<FlatList
			data={data}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			showsVerticalScrollIndicator={false}
			contentContainerClassName="flex flex-col gap-4"
			scrollEnabled={false}
		/>
	);
}
