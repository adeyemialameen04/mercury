import { Tabs } from "expo-router";
import { Repeat } from "~/lib/icons/Repeat";
import { ArrowLeftRight } from "~/lib/icons/ArrowLeftRight";
import React from "react";
import colors from "~/lib/colors";
import { Home } from "~/lib/icons/Home";
import { Settings } from "~/lib/icons/Settings";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				animation: "shift",
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<Home strokeWidth={1.25} size={size} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="[contract]"
				options={{
					headerShown: false,
					href: null,
				}}
			/>
			<Tabs.Screen
				name="swap"
				options={{
					title: "Swap",
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<Repeat strokeWidth={1.25} size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="transactions"
				options={{
					title: "Transactions",
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<ArrowLeftRight strokeWidth={1.25} size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings/index"
				options={{
					title: "Settings",
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<Settings strokeWidth={1.25} size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
