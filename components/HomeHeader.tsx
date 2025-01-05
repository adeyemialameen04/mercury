import { Input } from "./ui/input";
import React from "react";
import { Scan } from "~/lib/icons/Scan";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";
import { useCameraPermissions } from "expo-camera";
import { Button } from "./ui/button";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function HomeHeader() {
	const router = useRouter();
	const [permission, requestPermission] = useCameraPermissions();
	const { top } = useSafeAreaInsets();

	const handleScanPress = async () => {
		console.log(permission?.granted);
		if (!permission?.granted) {
			const { granted } = await requestPermission();
			if (!granted) return;
		}
		router.push("/(authenticated)/(modals)/send/scanner");
	};

	return (
		<BlurView intensity={80} tint="extraLight" style={{ paddingTop: top }}>
			<View className="px-5 flex-row bg-transparent h-14 gap-4 justify-between items-center flex">
				<Image
					source={require("~/assets/images/stacks-logo.png")}
					contentFit="contain"
					style={{ height: 30, width: 30, borderRadius: 20 }}
					placeholder={blurhash}
				/>

				<Input className="rounded-full flex-1 pl-6" placeholder="Search" />
				<ThemeToggle />
				<Button variant="ghost" size="icon" onPress={handleScanPress}>
					<Scan className="text-primary" strokeWidth={1.25} size={18} />
				</Button>
			</View>
		</BlurView>
	);
}
