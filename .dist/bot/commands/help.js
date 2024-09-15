import { bot } from "../bot";
export const helpCommand = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, "Here how can i help you...");
};
