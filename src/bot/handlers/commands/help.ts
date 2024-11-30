import { bot } from "@/bot/bot";
import { Message } from "node-telegram-bot-api";

export const helpCommand = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, "Here how can i help you...");
};
