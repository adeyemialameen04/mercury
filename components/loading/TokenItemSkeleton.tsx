import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export const TokenItemSkeleton = () => {
	return (
		<View className="flex justify-center">
			<View className="flex gap-3 flex-row">
				<View>
					<Skeleton className="h-10 w-10 rounded-full" />
				</View>
				<View className="flex flex-col justify-center gap-1">
					<Skeleton className="h-4 w-20 rounded-[4px]" />
					<Skeleton className="h-4 w-[120px] rounded-[4px]" />
				</View>
			</View>
		</View>
	);
};
