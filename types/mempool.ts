/**
 * Describes all transaction types on Stacks 2.0 blockchain
 */
export type MempoolTransaction =
	| MempoolTokenTransferTransaction
	| MempoolSmartContractTransaction
	| MempoolContractCallTransaction
	| MempoolPoisonMicroblockTransaction
	| MempoolCoinbaseTransaction
	| MempoolTenureChangeTransaction;
/**
 * Describes representation of a Type-0 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-0-transferring-an-asset
 */
export type MempoolTokenTransferTransaction = AbstractMempoolTransaction &
	TokenTransferTransactionMetadata;
/**
 * Abstract transaction. This schema makes up all properties common between all Stacks 2.0 transaction types
 */
export type AbstractMempoolTransaction = BaseTransaction & {
	tx_status: MempoolTransactionStatus;
	/**
	 * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
	 */
	receipt_time: number;
	/**
	 * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
	 */
	receipt_time_iso: string;
};
export type PostConditionMode = "allow" | "deny";
/**
 * Post-conditionscan limit the damage done to a user's assets
 */
export type PostCondition =
	| PostConditionStx
	| PostConditionFungible
	| PostConditionNonFungible;
export type PostConditionStx = {
	principal: PostConditionPrincipal;
} & {
	condition_code: PostConditionFungibleConditionCode;
	amount: string;
	type: "stx";
};
export type PostConditionPrincipal =
	| {
			/**
			 * String literal of type `PostConditionPrincipalType`
			 */
			type_id: "principal_origin";
	  }
	| {
			/**
			 * String literal of type `PostConditionPrincipalType`
			 */
			type_id: "principal_standard";
			address: string;
	  }
	| {
			/**
			 * String literal of type `PostConditionPrincipalType`
			 */
			type_id: "principal_contract";
			address: string;
			contract_name: string;
	  };
/**
 * A fungible condition code encodes a statement being made for either STX or a fungible token, with respect to the originating account.
 */
export type PostConditionFungibleConditionCode =
	| "sent_equal_to"
	| "sent_greater_than"
	| "sent_greater_than_or_equal_to"
	| "sent_less_than"
	| "sent_less_than_or_equal_to";
export type PostConditionFungible = {
	principal: PostConditionPrincipal;
} & {
	condition_code: PostConditionFungibleConditionCode;
	type: "fungible";
	amount: string;
	asset: {
		asset_name: string;
		contract_address: string;
		contract_name: string;
	};
};
export type PostConditionNonFungible = {
	principal: PostConditionPrincipal;
} & {
	condition_code: PostConditionNonFungibleConditionCode;
	type: "non_fungible";
	asset_value: {
		hex: string;
		repr: string;
	};
	asset: {
		asset_name: string;
		contract_address: string;
		contract_name: string;
	};
};
/**
 * A non-fungible condition code encodes a statement being made about a non-fungible token, with respect to whether or not the particular non-fungible token is owned by the account.
 */
export type PostConditionNonFungibleConditionCode = "sent" | "not_sent";
/**
 * `on_chain_only`: the transaction MUST be included in an anchored block, `off_chain_only`: the transaction MUST be included in a microblock, `any`: the leader can choose where to include the transaction.
 */
export type TransactionAnchorModeType =
	| "on_chain_only"
	| "off_chain_only"
	| "any";
/**
 * Status of the transaction
 */
export type MempoolTransactionStatus =
	| "pending"
	| "dropped_replace_by_fee"
	| "dropped_replace_across_fork"
	| "dropped_too_expensive"
	| "dropped_stale_garbage_collect"
	| "dropped_problematic";
/**
 * Describes representation of a Type-1 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-1-instantiating-a-smart-contract
 */
export type MempoolSmartContractTransaction = AbstractMempoolTransaction &
	SmartContractTransactionMetadata;
/**
 * Describes representation of a Type 2 Stacks 2.0 transaction: Contract Call
 */
export type MempoolContractCallTransaction = AbstractMempoolTransaction &
	ContractCallTransactionMetadata;
/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export type MempoolPoisonMicroblockTransaction = AbstractMempoolTransaction &
	PoisonMicroblockTransactionMetadata;
/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export type MempoolCoinbaseTransaction = AbstractMempoolTransaction &
	CoinbaseTransactionMetadata;
/**
 * Describes representation of a Type 7 Stacks transaction: Tenure Change
 */
export type MempoolTenureChangeTransaction = AbstractMempoolTransaction &
	TenureChangeTransactionMetadata;

/**
 * GET request that returns transactions
 */
export interface MempoolTransactionListResponse {
	limit: number;
	offset: number;
	total: number;
	results: MempoolTransaction[];
}
/**
 * Transaction properties that are available from a raw serialized transactions. These are available for transactions in the mempool as well as mined transactions.
 */
export interface BaseTransaction {
	/**
	 * Transaction ID
	 */
	tx_id: string;
	/**
	 * Used for ordering the transactions originating from and paying from an account. The nonce ensures that a transaction is processed at most once. The nonce counts the number of times an account's owner(s) have authorized a transaction. The first transaction from an account will have a nonce value equal to 0, the second will have a nonce value equal to 1, and so on.
	 */
	nonce: number;
	/**
	 * Transaction fee as Integer string (64-bit unsigned integer).
	 */
	fee_rate: string;
	/**
	 * Address of the transaction initiator
	 */
	sender_address: string;
	sponsor_nonce?: number;
	/**
	 * Denotes whether the originating account is the same as the paying account
	 */
	sponsored: boolean;
	sponsor_address?: string;
	post_condition_mode: PostConditionMode;
	post_conditions: PostCondition[];
	anchor_mode: TransactionAnchorModeType;
}
/**
 * Metadata associated with token-transfer type transactions
 */
export interface TokenTransferTransactionMetadata {
	tx_type: "token_transfer";
	token_transfer: {
		recipient_address: string;
		/**
		 * Transfer amount as Integer string (64-bit unsigned integer)
		 */
		amount: string;
		/**
		 * Hex encoded arbitrary message, up to 34 bytes length (should try decoding to an ASCII string)
		 */
		memo: string;
	};
}
/**
 * Metadata associated with a contract-deploy type transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-1-instantiating-a-smart-contract
 */
export interface SmartContractTransactionMetadata {
	tx_type: "smart_contract";
	smart_contract: {
		/**
		 * The Clarity version of the contract, only specified for versioned contract transactions, otherwise null
		 */
		clarity_version?: number;
		/**
		 * Contract identifier formatted as `<principaladdress>.<contract_name>`
		 */
		contract_id: string;
		/**
		 * Clarity code of the smart contract being deployed
		 */
		source_code: string;
	};
}
/**
 * Metadata associated with a contract-call type transaction
 */
export interface ContractCallTransactionMetadata {
	tx_type: "contract_call";
	contract_call: {
		/**
		 * Contract identifier formatted as `<principaladdress>.<contract_name>`
		 */
		contract_id: string;
		/**
		 * Name of the Clarity function to be invoked
		 */
		function_name: string;
		/**
		 * Function definition, including function name and type as well as parameter names and types
		 */
		function_signature: string;
		/**
		 * List of arguments used to invoke the function
		 */
		function_args?: {
			hex: string;
			repr: string;
			name: string;
			type: string;
		}[];
	};
}
/**
 * Metadata associated with a poison-microblock type transaction
 */
export interface PoisonMicroblockTransactionMetadata {
	tx_type: "poison_microblock";
	poison_microblock: {
		/**
		 * Hex encoded microblock header
		 */
		microblock_header_1: string;
		/**
		 * Hex encoded microblock header
		 */
		microblock_header_2: string;
	};
}
/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export interface CoinbaseTransactionMetadata {
	tx_type: "coinbase";
	coinbase_payload: {
		/**
		 * Hex encoded 32-byte scratch space for block leader's use
		 */
		data: string;
		/**
		 * A principal that will receive the miner rewards for this coinbase transaction. Can be either a standard principal or contract principal. Only specified for `coinbase-to-alt-recipient` transaction types, otherwise null.
		 */
		alt_recipient?: string;
		/**
		 * Hex encoded 80-byte VRF proof
		 */
		vrf_proof?: string;
	};
}
/**
 * Describes representation of a Type 7 Stacks transaction: Tenure Change
 */
export interface TenureChangeTransactionMetadata {
	tx_type: "tenure_change";
	tenure_change_payload?: {
		/**
		 * Consensus hash of this tenure. Corresponds to the sortition in which the miner of this block was chosen.
		 */
		tenure_consensus_hash: string;
		/**
		 * Consensus hash of the previous tenure. Corresponds to the sortition of the previous winning block-commit.
		 */
		prev_tenure_consensus_hash: string;
		/**
		 * Current consensus hash on the underlying burnchain. Corresponds to the last-seen sortition.
		 */
		burn_view_consensus_hash: string;
		/**
		 * (Hex string) Stacks Block hash
		 */
		previous_tenure_end: string;
		/**
		 * The number of blocks produced in the previous tenure.
		 */
		previous_tenure_blocks: number;
		/**
		 * Cause of change in mining tenure. Depending on cause, tenure can be ended or extended.
		 */
		cause: "block_found" | "extended";
		/**
		 * (Hex string) The ECDSA public key hash of the current tenure.
		 */
		pubkey_hash: string;
	};
}
