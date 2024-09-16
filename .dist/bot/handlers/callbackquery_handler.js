import { menuActions } from "../commands/menu";
import logger from "../../utils/logger";
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
    // if (data.command === "create") {
    //   handleCreateWallet(callbackQuery.message as Message);
    // } else if (data.command === "add") {
    //   handleAddExistingWallet(callbackQuery.message as Message);
    // }
    console.log(data);
};
