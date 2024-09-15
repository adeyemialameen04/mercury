import { handleCreateWallet } from "../commands/start";
export const handleCallbackQuery = (callbackQuery) => {
    const data = JSON.parse(callbackQuery.data);
    if (data.command === "create") {
        handleCreateWallet(callbackQuery.message);
    }
    console.log(data);
};
