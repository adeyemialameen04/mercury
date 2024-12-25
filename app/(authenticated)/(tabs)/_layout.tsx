import { Tabs } from "expo-router";
import React from "react";
import HomeHeader from "~/components/HomeHeader";
import colors from "~/lib/colors";
import { Home } from "~/lib/icons/Home";
import { Settings } from "~/lib/icons/Settings";
import { Send } from "~/lib/icons/Send";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ size, color }) => (
						<Home strokeWidth={1.25} size={size} color={color} />
					),
					header: () => <HomeHeader />,
				}}
			/>

			<Tabs.Screen
				name="send"
				options={{
					title: "Send",
					tabBarIcon: ({ size, color }) => (
						<Send strokeWidth={1.25} size={size} color={color} />
					),
					headerShown: false,
					tabBarStyle: { display: "none" },
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ size, color }) => (
						<Settings strokeWidth={1.25} size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
