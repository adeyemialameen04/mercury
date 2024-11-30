import { generateNewWallet } from "@/services/wallet-generation";
import logger from "@/utils/logger";
import TelegramBot, { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { menuActions } from "./commands/menu";
import { handleBack } from "./general";
// import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";

export const handleCallbackQuery = async (
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

  if (command === "create") {
    const walletInfo = await generateNewWallet("HelloPassword123")
    console.log(JSON.stringify(walletInfo, null, 2));
    // handleCreateWallet(callbackQuery.message as Message);
  } else if (command === "add") {
    // handleAddExistingWallet(callbackQuery.message as Message);
  }
  logger.info(`callbackQuery ${data}`);
};
