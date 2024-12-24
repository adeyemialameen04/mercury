import { BlurView } from "expo-blur";
import { Stack, useGlobalSearchParams } from "expo-router";
import { View } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { Large } from "~/components/ui/typography";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { getTokenMetadata } from "~/queries/token";
import { FtMetadataResponse } from "~/types/metadata";

export default function SendLayout() {
	const { contract } = useGlobalSearchParams();
	const contractID = contract as string;
	const { isLoading, data } = useQuery<FtMetadataResponse | null>(
		[`contract-${contractID}`],
		() => (contractID ? getTokenMetadata(contractID) : null),
		{
			enabled: !!contractID,
		},
	);

	return (
		<Stack>
			<Stack.Screen
				name="[contract]"
				options={{
					header: () => {
						const { top, bottom } = useSafeAreaInsets();

						return (
							<BlurView
								intensity={80}
								tint={"extraLight"}
								style={{ paddingTop: top, paddingBottom: bottom }}
							>
								<View className="flex flex-row items-center justify-center py-2 px-4">
									<View className="flex-1">
										<Button variant={"ghost"}>
											<ArrowLeft strokeWidth={1.25} className="text-primary" />
										</Button>
									</View>
									<View className="flex-1 items-center">
										{isLoading ? (
											<Skeleton className="h-10 w-10 rounded-4" />
										) : (
											<Text className="text-center">{data?.symbol}</Text>
										)}
									</View>
								</View>
							</BlurView>
						);
					},
					presentation: "modal",
				}}
			/>
		</Stack>
	);
}
