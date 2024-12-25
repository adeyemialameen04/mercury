export interface FtMetadataResponse {
	name?: string;
	symbol?: string;
	decimals?: number;
	total_supply?: string;
	token_uri?: string;
	description?: string;
	image_uri?: string;
	image_thumbnail_uri?: string;
	image_canonical_uri?: string;
	tx_id: string;
	sender_address: string;
	asset_identifier: string;
	metadata?: Metadata;
}
export interface Metadata {
	sip: number;
	name?: string;
	description?: string;
	image?: string;
	cached_image?: string;
	cached_thumbnail_image?: string;
	attributes?: MetadataAttribute[];
	properties?: MetadataProperties;
	localization?: MetadataLocalization;
}
export interface MetadataAttribute {
	trait_type: string;
	display_type?: string;
	value: MetadataValue;
}
export interface MetadataValue {
	[k: string]: unknown;
}
export interface MetadataProperties {
	[k: string]: MetadataValue1;
}
export interface MetadataValue1 {
	[k: string]: unknown;
}
export interface MetadataLocalization {
	uri: string;
	default: string;
	locales: string[];
}
