import { Input } from "./ui/input";
import React from "react";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Text } from "./ui/text";
const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";
export default function HomeHeader() {
	const { top } = useSafeAreaInsets();
	return (
		<BlurView intensity={80} tint={"extraLight"} style={{ paddingTop: top }}>
			<View className="px-5 flex-row bg-transparent h-14 gap-4 items-center justify-center flex">
				<Avatar alt="Zach Nugent's Avatar">
					<AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
					<AvatarFallback>
						<Text>ZN</Text>
					</AvatarFallback>
				</Avatar>
				<Input
					className="rounded-full flex-1 placeholder:text-sm pl-6"
					placeholder="Search"
				/>
				<ThemeToggle />
			</View>
		</BlurView>
	);
}
