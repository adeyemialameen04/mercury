import TelegramBot, { Message } from "node-telegram-bot-api";
// import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";
import { menuActions } from "../commands/menu";
import logger from "../../utils/logger";
import { handleBack } from "./general";
import { bot } from "../bot";

export const handleCallbackQuery = (
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const { message, data } = callbackQuery;
  const { command, action } = JSON.parse(data || "{}");

  if (command === "menu") {
    const menuAction = menuActions.find((item) => item.action === action);
    if (menuAction && typeof menuAction.func === "function") {
      menuAction.func(message as Message);
    } else {
      logger.error(`No action found for: ${action}`);
    }
  } else if (command === "back") {
    handleBack(message as Message, action);
  }

  if (!command) {
    logger.info("No command");
    if (action === "close") {
      bot.deleteMessage(
        message?.chat.id as number,
        message?.message_id as number,
      );
    }
  }

  // if (data.command === "create") {
  //   handleCreateWallet(callbackQuery.message as Message);
  // } else if (data.command === "add") {
  //   handleAddExistingWallet(callbackQuery.message as Message);
  // }
  logger.info(`callbackQuery ${data}`);
};
