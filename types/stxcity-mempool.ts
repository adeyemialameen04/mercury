export interface Welcome {
	total_tx?: number;
	count?: Count;
	estimate_fee?: EstimateFee;
	top_highest_fee_function_call?: Top[];
	top_highest_fee_contract_deploy?: any[];
	top_highest_token_transfer?: Top[];
	top_stuck_txs?: Top[];
	top_tx_spammer?: TopTxSpammer[];
}

export interface Count {
	function_call?: number;
	contract_deploy?: number;
	token_transfer?: number;
}

export interface EstimateFee {
	token_transfer?: SmartContractClass;
	contract_call?: SmartContractClass;
	smart_contract?: SmartContractClass;
}

export interface SmartContractClass {
	no_priority?: number;
	low_priority?: number;
	medium_priority?: number;
	high_priority?: number;
}

export interface Top {
	tx_id?: string;
	nonce?: number;
	fee_rate?: string;
	sender_address?: string;
	tx_status?: "pending";
	receipt_time?: number;
	receipt_time_iso?: Date;
	tx_type?: string;
	contract_call?: TopHighestFeeFunctionCallContractCall;
	token_transfer?: TokenTransfer;
}

export interface TopHighestFeeFunctionCallContractCall {
	contract_id?: string;
	function_name?: string;
	function_signature?: string;
	function_args?: FunctionArg[];
}

export interface FunctionArg {
	hex?: string;
	repr?: string;
	name?: string;
	type?: string;
}

export interface TokenTransfer {
	recipient_address?: string;
	amount?: string;
	memo?: string;
}

// export type TxType = "contract_call" | "token_transfer";

export interface TopTxSpammer {
	maker?: string;
	number_of_txs?: number;
}
