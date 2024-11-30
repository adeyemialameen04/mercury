import TelegramBot from "node-telegram-bot-api";
import { settings } from "../config/constants";
import { handleMessage } from "./handlers/message_handler";
import { handleCallbackQuery } from "./handlers/callbackquery_handler";
import logger from "../utils/logger";
import { startHandler } from "./handlers/commands/start";

console.log(settings);
export const bot = new TelegramBot(settings.token!, { polling: true });
logger.info("Bot started");
bot.onText(/\/start/, startHandler);

bot.on("message", handleMessage);

bot.on("callback_query", handleCallbackQuery);

// bot.on("message", (msg: Message) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text;
//   const opts = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "EUR",
//             callback_data: JSON.stringify({
//               command: "price",
//               base: "EUR",
//             }),
//           },
//           {
//             text: "USD",
//             callback_data: JSON.stringify({
//               command: "price",
//               base: "USD",
//             }),
//           },
//         ],
//       ],
//     },
//   };
//
//   if (messageText === "/start") {
//     bot.sendMessage(chatId, "Welcome to the bot updated", opts);
//   }
// });

// bot.on("callback_query", (callbackQuery: TelegramBot.CallbackQuery) => {
//   const data = JSON.parse(callbackQuery.data as string);
//   const chatId = callbackQuery.message?.chat.id;
//
//   const command = data.command;
//   const base = data.base;
//
//   if (command === "price") {
//     bot.sendMessage(chatId as number, `Fetching price for ${base}...`);
//   }
// });
