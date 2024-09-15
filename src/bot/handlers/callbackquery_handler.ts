import TelegramBot, { Message } from "node-telegram-bot-api";
import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";

export const handleCallbackQuery = (
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const data = JSON.parse(callbackQuery.data as string);
  if (data.command === "create") {
    handleCreateWallet(callbackQuery.message as Message);
  } else if (data.command === "add") {
    handleAddExistingWallet(callbackQuery.message as Message);
  }
  console.log(data);
};
