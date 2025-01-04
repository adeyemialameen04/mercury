import React from "react";
import { View, Text } from "react-native";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const TokenCardSkeleton = () => {
	return (
		<Card className="w-full">
			<CardHeader>
				<View className="flex flex-row gap-4 items-center">
					<Skeleton className="h-12 w-12 rounded-full" />
					<View className="flex flex-col gap-2">
						<Skeleton className="h-6 w-32" />
						<View className="flex flex-col gap-1">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-36" />
						</View>
					</View>
				</View>

				<Skeleton className="h-16 w-full mt-4" />

				<View className="flex flex-col gap-1 mt-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-2 w-full mt-2" />
				</View>
			</CardHeader>

			<CardContent>
				<View className="flex flex-col gap-4">
					<Skeleton className="h-10 w-32" />

					<View className="flex flex-col gap-4 mt-3">
						<View className="flex flex-col gap-2">
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-full" />
						</View>

						<View className="flex flex-row gap-4 justify-between">
							<Skeleton className="h-16 w-36" />
							<Skeleton className="h-16 w-36" />
						</View>

						<View className="flex flex-row gap-4 justify-between">
							<Skeleton className="h-16 w-36" />
							<Skeleton className="h-16 w-36" />
						</View>
					</View>
				</View>
			</CardContent>

			<CardFooter>
				<View className="flex-1">
					<View className="flex-row w-full gap-4">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 flex-1" />
					</View>
				</View>
			</CardFooter>
		</Card>
	);
};

export default TokenCardSkeleton;
