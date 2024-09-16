import { bot } from "../bot";
import { generateSecretKey, generateWallet, restoreWalletAccounts, } from "@stacks/wallet-sdk";
import { StacksMainnet } from "@stacks/network";
export const startCommand = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, "Welcome to Mecury ", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🚀 Create a New Wallet",
                        callback_data: JSON.stringify({ command: "create" }),
                    },
                ],
                [
                    {
                        text: "💼 Add an Existing Wallet",
                        callback_data: JSON.stringify({ command: "add" }),
                    },
                ],
                [{ text: "🔍 Learn More", url: "https://www.linkbarn.tech" }],
            ],
        },
    });
};
//export const handleCreateWallet = (msg: Message) => {
//  const chatId = msg.chat.id;
//  return bot.sendMessage(
//    chatId,
//    "Okay we are setting up a new wallet for you.."
//  );
//};
export const handleCreateWallet = async (msg) => {
    const chatId = msg.chat.id;
    /**
     * to generate a wallet for the user we need to ask them for a pass to be
      linked to the wallet
     */
    const password = "password"; // this should be the password the user provides
    /* to generate a new secret key for the user.
    without passing any param to the `generateSecretKey` function, it will
    generate a 24-word secret key and passing 128 as a param will generate a
    12-word secret key
    */
    const secretKey = generateSecretKey(128);
    // create a wallet object
    const wallet = await generateWallet({ secretKey, password });
    console.log(wallet);
    return bot.sendMessage(chatId, "Okay we are setting up a new wallet for you..");
};
export const handleAddAccount = async (msg) => {
    // in stacks, after the first wallet have been created users can choose to add accounts this is done to diversify the assets.
    // we should find a way to get the user wallet object here, or merge this function with `handleCreateWallet`
    //wallet = await generateNewAccount(wallet); // adds a new account to an existing wallet object, immutable, NOT in-place
};
export const handleAddExistingWallet = async (msg) => {
    const chatId = msg.chat.id;
    const restoreWallet = await restoreWalletAccounts({
        // `baseWallet` is returned from `generateWallet`
        // Users can host their own Gaia hub, and this library's API can use that Gaia hub, if provided.
        // i dont understand what they mean by the above 🥺
        wallet: baseWallet,
        gaiaHubUrl: "https://hub.blockstack.org",
        network: new StacksMainnet(),
    });
    return bot.sendMessage(chatId, "Okay we are adding a new wallet for you now. ");
};
