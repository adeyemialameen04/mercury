import { makeSTXTokenTransfer, AnchorMode } from "@stacks/transactions";

const transaction = await makeSTXTokenTransfer({
	recipient: "SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159",
	amount: 12345n,
	senderKey:
		"753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
	network: "mainnet" as const,
});
