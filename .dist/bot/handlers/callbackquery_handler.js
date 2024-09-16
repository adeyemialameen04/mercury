// import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";
import { menuActions } from "../commands/menu";
import logger from "../../utils/logger";
import { handleBack } from "./general";
import { bot } from "../bot";
export const handleCallbackQuery = (callbackQuery) => {
    const { message, data } = callbackQuery;
    const { command, action } = JSON.parse(data || "{}");
    if (command === "menu") {
        const menuAction = menuActions.find((item) => item.action === action);
        if (menuAction && typeof menuAction.func === "function") {
            menuAction.func(message);
        }
        else {
            logger.error(`No action found for: ${action}`);
        }
    }
    else if (command === "back") {
        handleBack(message, action);
    }
    if (!command) {
        logger.info("No command");
        if (action === "close") {
            bot.deleteMessage(message?.chat.id, message?.message_id);
        }
    }
    // if (data.command === "create") {
    //   handleCreateWallet(callbackQuery.message as Message);
    // } else if (data.command === "add") {
    //   handleAddExistingWallet(callbackQuery.message as Message);
    // }
    logger.info(`callbackQuery ${data}`);
};
