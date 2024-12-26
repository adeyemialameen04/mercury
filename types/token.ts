export type TokenData = {
	balance: string;
	contract: string;
	currentPrice?: number;
	decimals?: number;
	description?: string;
	formattedBalAmt: number;
	image: string;
	name: string;
	originalBal: string;
	priceChangePercentage24h?: number;
	supported: boolean;
	ticker: string;
	tokenFiatRate?: string;
};
