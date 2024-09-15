import { handleAddExistingWallet, handleCreateWallet } from "../commands/start";
export const handleCallbackQuery = (callbackQuery) => {
    const data = JSON.parse(callbackQuery.data);
    if (data.command === "create") {
        handleCreateWallet(callbackQuery.message);
    }
    else if (data.command === "add") {
        handleAddExistingWallet(callbackQuery.message);
    }
    console.log(data);
};
