import { helpCommand } from "../commands/help";
import { bot } from "../bot";
export const handleMessage = (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";
    if (text === "/help") {
        helpCommand(msg);
    }
    else if (text === "/start")
        return;
    else {
        bot.sendMessage(chatId, "I dunno");
    }
};
