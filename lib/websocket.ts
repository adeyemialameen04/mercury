// Frontend: lib/websocket.ts
export class TransactionWebSocket {
	private ws: WebSocket | null = null;

	constructor(
		private url: string = "ws://c12c-104-28-251-98.ngrok-free.app/ws",
	) {}

	connect() {
		try {
			this.ws = new WebSocket(this.url);

			this.ws.onopen = () => {
				console.log("WebSocket Connected");
			};

			this.ws.onclose = () => {
				console.log("WebSocket Disconnected");
			};

			this.ws.onerror = (error) => {
				console.error("WebSocket Error:", error);
			};

			this.ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					console.log("Received:", data);
				} catch (error) {
					console.error("Error parsing message:", error);
				}
			};
		} catch (error) {
			console.error("Connection error:", error);
		}
	}

	trackTransaction(txId: string, expoPushToken: string, stxAddr: string) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			console.error("WebSocket is not connected");
			return;
		}

		const message = {
			type: "track-transaction", // Add message type
			data: {
				// Wrap data in a data field
				txId,
				expoPushToken,
				stxAddr,
			},
		};

		this.ws.send(JSON.stringify(message));
	}

	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
}
