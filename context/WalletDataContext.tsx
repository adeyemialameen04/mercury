import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
} from "react";
import {
	retrieveWalletData,
	deleteWalletData,
	storeWalletData,
} from "~/lib/storage";
import { WalletData } from "~/types/wallet";

interface WalletDataContextType {
	walletData: WalletData | null;
	setWalletData: (data: WalletData | null) => Promise<void>;
	deleteWallet: () => Promise<void>;
	isLoading: boolean;
	isWalletConnected: boolean;
}

const WalletDataContext = createContext<WalletDataContextType | undefined>(
	undefined,
);

export const useWalletData = () => {
	const context = useContext(WalletDataContext);
	if (context === undefined) {
		throw new Error("useWalletData must be used within a WalletDataProvider");
	}
	return context;
};

interface WalletDataProviderProps {
	children: ReactNode;
}

export const WalletDataProvider: React.FC<WalletDataProviderProps> = ({
	children,
}) => {
	const [walletData, setWalletDataState] = useState<WalletData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isWalletConnected, setIsWalletConnected] = useState(false);

	useEffect(() => {
		const loadWalletData = async () => {
			try {
				const data = await retrieveWalletData();
				setWalletDataState(data);
				setIsWalletConnected(!!data);
			} catch (error) {
				console.error("Failed to load wallet data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadWalletData();
	}, []);

	const deleteWallet = async () => {
		await deleteWalletData();
		setWalletDataState(null);
		setIsWalletConnected(false);
	};

	const setWalletData = async (data: WalletData | null) => {
		setWalletDataState(data);
		setIsWalletConnected(!!data);
		if (data) {
			await storeWalletData(data);
		}
	};

	return (
		<WalletDataContext.Provider
			value={{
				walletData,
				setWalletData,
				isLoading,
				deleteWallet,
				isWalletConnected,
			}}
		>
			{children}
		</WalletDataContext.Provider>
	);
};
