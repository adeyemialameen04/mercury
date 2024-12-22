import { Tabs } from "expo-router";
import React from "react";
import colors from "~/lib/colors";
import { Home } from "~/lib/icons/Home";
import { Settings } from "~/lib/icons/Settings";

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
