export const truncateAddress = (address: string) => {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const truncateContract = (address: string) => {
	if (!address) return "";
	return `${address.slice(0, 10)}...${address.slice(-14)}`;
};

export const truncateTXID = (address: string) => {
	if (!address) return "";
	return `${address.slice(0, 10)}...${address.slice(-14)}`;
};
