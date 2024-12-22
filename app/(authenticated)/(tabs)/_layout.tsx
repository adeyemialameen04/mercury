import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import "~/utils/sheets";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					// tabBarIcon: ({ color }) => (
					// 	<IconSymbol size={28} name="house.fill" color={color} />
					// ),
				}}
			/>
		</Tabs>
	);
}
