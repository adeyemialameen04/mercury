const SLIPPAGE_CONSTRAINTS = {
	MIN_SLIPPAGE: 0,
	MAX_SLIPPAGE: 50,
} as const;

export const validateSlippage = (slippagePercentage: number): void => {
	if (typeof slippagePercentage !== "number" || isNaN(slippagePercentage)) {
		throw new Error("Slippage must be a valid number");
	}

	if (slippagePercentage < SLIPPAGE_CONSTRAINTS.MIN_SLIPPAGE) {
		throw new Error(
			`Slippage cannot be negative. Minimum allowed slippage is ${SLIPPAGE_CONSTRAINTS.MIN_SLIPPAGE}%`,
		);
	}

	if (slippagePercentage > SLIPPAGE_CONSTRAINTS.MAX_SLIPPAGE) {
		throw new Error(
			`Slippage cannot exceed ${SLIPPAGE_CONSTRAINTS.MAX_SLIPPAGE}%`,
		);
	}
};

export const calculateMinimumTokensWithSlippage = (
	expectedTokenAmount: number,
	slippagePercentage: number,
): number => {
	validateSlippage(slippagePercentage);

	// Convert percentage to decimal (e.g., 0.5% = 0.005)
	const slippageDecimal = slippagePercentage / 100;

	// Calculate minimum tokens accounting for slippage
	// Formula: expectedAmount * (1 - slippage)
	const minimumTokens = expectedTokenAmount * (1 - slippageDecimal);

	return minimumTokens;
};
