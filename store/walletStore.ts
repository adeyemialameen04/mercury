import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./mmkv-storage";
import { WalletData } from "~/types/wallet";

interface WalletStore {
	walletData: WalletData | null;
	isLoading: boolean;
	isWalletConnected: boolean;
	setWalletData: (data: WalletData | null) => Promise<void>;
	deleteWallet: () => void;
}

export const useWalletStore = create<WalletStore>()(
	persist(
		(set) => ({
			walletData: null,
			isLoading: false,
			isWalletConnected: false,

			setWalletData: async (data: WalletData | null) => {
				set({
					walletData: data,
					isWalletConnected: !!data,
				});
			},

			deleteWallet: () => {
				set({
					walletData: null,
					isWalletConnected: false,
				});
			},
		}),
		{
			name: "wallet-storage",
			storage: createJSONStorage(() => zustandStorage),
			partialize: (state) => ({
				walletData: state.walletData,
				isWalletConnected: state.isWalletConnected,
			}),
		},
	),
);
