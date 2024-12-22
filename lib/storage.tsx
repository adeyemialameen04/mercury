import AsyncStorage from "@react-native-async-storage/async-storage";
import { WalletData } from "~/types/wallet";

const walletKey = "walletData";
export const storeWalletData = async (value: WalletData) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(walletKey, jsonValue);
	} catch (e) {
		console.error(e);
	}
};

export const retrieveWalletData = async (): Promise<WalletData | null> => {
	try {
		const jsonValue = await AsyncStorage.getItem(walletKey);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const deleteWalletData = async () => {
	try {
		await AsyncStorage.removeItem(walletKey);
	} catch (e) {
		console.error(e);
		return null;
	}
};
