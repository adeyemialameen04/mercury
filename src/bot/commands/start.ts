import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";

export const startCommand = (msg: Message) => {
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

export const handleCreateWallet = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(
    chatId,
    "Okay we are setting up a new wallet for you..",
  );
};

export const handleAddExistingWallet = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(
    chatId,
    "Okay we are adding a new wallet for you now. ",
  );
};
