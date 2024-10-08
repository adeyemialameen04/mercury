import { Message } from "node-telegram-bot-api";
import { helpCommand } from "../commands/help";
import { bot } from "../bot";
import { handleMenu } from "../commands/menu";

export const handleMessage = (msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (text === "/help") {
    helpCommand(msg);
  } else if (text === "/start") return;
  else if (text === "/menu") {
    handleMenu(msg);
  } else {
    bot.sendMessage(chatId, "I dunno");
  }
};
