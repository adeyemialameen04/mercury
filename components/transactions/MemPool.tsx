import { useQuery } from "react-query";
import { getMempoolStatsFromStxCity } from "~/queries/transactions";
import { SectionList, RefreshControl, View } from "react-native";
import { useCallback, useMemo } from "react";
import { Top, Welcome } from "~/types/stxcity-mempool";
import { TxItem } from "./TxItem";
import { Card, CardHeader, CardTitle } from "../ui/card";

type Section = {
	title: string;
	data: Top[];
};

export default function MemPool() {
	const { data, isLoading, refetch } = useQuery<Welcome>(
		["mempool"],
		async () => {
			return getMempoolStatsFromStxCity();
		},
	);

	const sections = useMemo<Section[]>(
		() => [
			{
				title: "Top 5 Pending Function Calls by Fee",
				data: data?.top_highest_fee_function_call || [],
			},
			{
				title: "Top 5 Pending STX Transfers by Fee",
				data: data?.top_highest_token_transfer || [], // Replace with different data if needed
			},
		],
		[data],
	);

	const renderItem = useCallback(
		({ item }: { item: Top }) => <TxItem top={item} />,
		[],
	);

	const renderSectionHeader = useCallback(
		({ section: { title } }: { section: Section }) => (
			<Card className="w-full mt-3">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			</Card>
		),
		[],
	);

	return (
		<SectionList
			sections={sections}
			renderItem={renderItem}
			renderSectionHeader={renderSectionHeader}
			showsVerticalScrollIndicator={false}
			contentContainerClassName="flex flex-col gap-4"
			refreshControl={
				<RefreshControl refreshing={isLoading} onRefresh={refetch} />
			}
			stickySectionHeadersEnabled={false}
		/>
	);
}
