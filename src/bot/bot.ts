import TelegramBot from "node-telegram-bot-api";
import { settings } from "../config/constants";
import { handleMessage } from "./handlers/message_handler";
import { handleCallbackQuery } from "./handlers/callbackquery_handler";

console.log(settings);
export const bot = new TelegramBot(settings.token!, { polling: true });
bot.on("message", handleMessage);
bot.on("callback_query", handleCallbackQuery);
