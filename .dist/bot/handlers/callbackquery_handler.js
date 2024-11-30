import { generateNewWallet } from "@/services/wallet-generation";
import logger from "@/utils/logger";
import { bot } from "../bot";
import { menuActions } from "./commands/menu";
import { handleBack } from "./general";
// import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";
export const handleCallbackQuery = async (callbackQuery) => {
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
    if (command === "create") {
        const walletInfo = await generateNewWallet("HelloPassword123");
        console.log(JSON.stringify(walletInfo, null, 2));
        // handleCreateWallet(callbackQuery.message as Message);
    }
    else if (command === "add") {
        // handleAddExistingWallet(callbackQuery.message as Message);
    }
    logger.info(`callbackQuery ${data}`);
};
