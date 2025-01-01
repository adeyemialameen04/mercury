import { Input } from "./ui/input";
import React from "react";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Text } from "./ui/text";
import { Link } from "expo-router";
const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";
export default function HomeHeader() {
	const { top, bottom } = useSafeAreaInsets();
	return (
		<BlurView
			intensity={80}
			tint={"extraLight"}
			style={{ paddingTop: top, paddingBottom: bottom }}
		>
			<View className="px-5 flex-row bg-transparent h-14 gap-4 items-center justify-between flex">
				<Link asChild href={"(authenticated)/(tabs)/home"}>
					<Avatar alt="Zach Nugent's Avatar">
						<AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
						<AvatarFallback>
							<Text>ZN</Text>
						</AvatarFallback>
					</Avatar>
				</Link>
				<Input className="rounded-full flex-1 pl-6" placeholder="Search" />
				<ThemeToggle />
			</View>
		</BlurView>
	);
}
