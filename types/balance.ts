export type AccountBalance = {
	stx: {
		balance: string;
		total_sent: string;
		total_received: string;
		total_fees_sent: string;
		total_miner_rewards_received: string;
		lock_tx_id: string;
		locked: string;
		lock_height: number;
		burnchain_lock_height: number;
		burnchain_unlock_height: number;
		estimated_balance: string;
	};
	fungible_tokens: {
		[key: string]: {
			balance: string;
			total_sent: string;
			total_received: string;
		};
	};
	non_fungible_tokens: Record<string, never>;
	bns: string | null;
};
