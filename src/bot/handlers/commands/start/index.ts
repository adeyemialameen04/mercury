import { bot } from "@/bot/bot";
import { formatText } from "@/utils/format_text";
import { Message } from "node-telegram-bot-api";

export const startHandler = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, formatText("Welcome to Mecury\nLet's get you started here shall we."), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Create a New Wallet",
            callback_data: JSON.stringify({ command: "start", action: "create" }),
          },
        ],
        [
          {
            text: "💼 Add an Existing Wallet",
            callback_data: JSON.stringify({ command: "start", action: "add" }),
          },
        ],
        [{ text: "🔍 Learn More", url: "https://www.linkbarn.tech" }],
      ],
    },
  });
};
