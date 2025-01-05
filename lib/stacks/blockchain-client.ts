import { StacksApiSocketClient } from "@stacks/blockchain-api-client";
import { HIRO_MAINNET_API_URL } from "../constants";

export const sc = new StacksApiSocketClient({ url: HIRO_MAINNET_API_URL });
