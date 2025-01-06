import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "~/utils/registerForPushNotificationsAsync";
import { useRouter } from "expo-router";
import { getTokens } from "~/queries/token";

// Add this configuration at the start
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

interface NotificationContextType {
	expoPushToken: string | null;
	notification: Notifications.Notification | null;
	error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotification must be used within a NotificationProvider",
		);
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
	children,
}) => {
	const router = useRouter();
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] =
		useState<Notifications.Notification | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const notificationListener = useRef<EventSubscription>();
	const responseListener = useRef<EventSubscription>();

	useEffect(() => {
		registerForPushNotificationsAsync().then(
			(token) => setExpoPushToken(token),
			(error) => setError(error),
		);

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log("🔔 Notification Received: ", notification);
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				async (response) => {
					console.log(
						"🔔 Notification Response: ",
						JSON.stringify(response, null, 2),
						JSON.stringify(response.notification.request.content.data, null, 2),
					);
					const data = response.notification.request.content.data;
					if (data && data.type === "new-token-stx-city") {
						const coins = [data.tokenContract];
						const tokensData = await getTokens(coins);
						const tokenData = tokensData[0];
						router.push({
							pathname: "/(authenticated)/(tabs)/[contract]",
							params: {
								contract: data.tokenContract,
								activeTab: "stx-city",
								tokenData: JSON.stringify({
									...tokenData,
									// formattedBalAmt: balAmt,
									// originalBal: item.balance,
								}),
							},
						});
						// const tokenData = await
						// href={{
						// 	pathname: "/(authenticated)/(tabs)/[contract]",
						// 	params: {
						// 		contract: item.contract,
						// 		tokenData: JSON.stringify({
						// 			...item,
						// 			formattedBalAmt: balAmt,
						// 			originalBal: item.balance,
						// 		}),
						// 	},
						// }}
					}
				},
			);

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(
					notificationListener.current,
				);
			}
			if (responseListener.current) {
				Notifications.removeNotificationSubscription(responseListener.current);
			}
		};
	}, []);

	return (
		<NotificationContext.Provider
			value={{ expoPushToken, notification, error }}
		>
			{children}
		</NotificationContext.Provider>
	);
};
