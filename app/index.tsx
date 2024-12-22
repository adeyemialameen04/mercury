import { View, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H4 } from "~/components/ui/typography";
import { SheetManager } from "react-native-actions-sheet";
import { Badge } from "~/components/ui/badge";

const introVidUrl =
	"https://res.cloudinary.com/dzsomaq4z/video/upload/v1734893537/intro_o9wkhc.mp4";

export default function Page() {
	const player = useVideoPlayer(introVidUrl, (player) => {
		if (player) {
			player.loop = true;
			player.play();
		}
	});

	return (
		<View className="flex-1 justify-between flex flex-col">
			<VideoView
				player={player}
				allowsFullscreen
				allowsPictureInPicture={false}
				style={styles.video}
				nativeControls={false}
				contentFit="cover"
			/>
			<View className="mt-[80px] p-[20px]">
				<H4 className="text-white text-2xl uppercase font-black">
					Ready to change the way you degen?
				</H4>
			</View>
			<View className="flex items-center mb-[60px] px-[10px] flex-row gap-4 justify-center">
				<Button
					variant="secondary"
					className="flex-1 relative rounded-full"
					size={"lg"}
					onPress={() => {
						SheetManager.show("wallet-sheet-with-router");
					}}
				>
					<Text className="font-semibold">Generate Wallet</Text>
					<Badge className="absolute -right-2 -top-3 bg-primary">
						<Text className="text-xs">Suggested</Text>
					</Badge>
				</Button>

				<Button
					variant="secondary"
					className="flex-1 rounded-full"
					size={"lg"}
					onPress={() => {
						SheetManager.show("import-wallet-sheet");
					}}
				>
					<Text className="font-semibold">Import Wallet</Text>
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	video: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
});
