import React, { createContext, useContext, useEffect, useState } from "react";
import { TransactionWebSocket } from "~/lib/websocket";

// Create the context with the correct type
const WebSocketContext = createContext<TransactionWebSocket | null>(null);

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [wsClient] = useState(() => new TransactionWebSocket());

	useEffect(() => {
		wsClient.connect();
		return () => {
			wsClient.disconnect();
		};
	}, []);

	return (
		<WebSocketContext.Provider value={wsClient}>
			{children}
		</WebSocketContext.Provider>
	);
};

// Custom hook with type safety
export const useWebSocket = (): TransactionWebSocket => {
	const context = useContext(WebSocketContext);
	if (context === null) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
