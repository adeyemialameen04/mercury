import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import {
  generateSecretKey,
  generateWallet,
  generateNewAccount,
  restoreWalletAccounts,
} from "@stacks/wallet-sdk";
import { StacksMainnet } from "@stacks/network";

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
