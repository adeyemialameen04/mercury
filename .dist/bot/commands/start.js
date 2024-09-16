import { bot } from "../bot";
import { generateSecretKey, generateWallet } from "@stacks/wallet-sdk";
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
export const handleCreateWallet = (msg) => {
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
    const wallet = generateWallet({ secretKey, password });
    return bot.sendMessage(chatId, "Okay we are setting up a new wallet for you..");
};
export const handleAddExistingWallet = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, "Okay we are adding a new wallet for you now. ");
};
