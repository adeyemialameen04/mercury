import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { helpCommand } from "./commands/help";
import { handleMenu } from "./commands/menu";
import { startHandler } from "./commands/start";

const userStates: { [chatId: number]: { awaitingPassword: boolean } } = {};

export const handleMessage = (msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (text === "/help") {
    helpCommand(msg);
  } else if (text === "/start") {
    startHandler(msg)
  }
  else if (text === "/menu") {
    handleMenu(msg);
  } else {
    bot.sendMessage(chatId, "I dunno");
  }
};
