import { formatText } from "@/utils/format_text";
import { bot } from "../bot";
import { menuInlineKeyboard } from "../ui/menu";
export const handleBack = (msg, to) => {
    const chatId = msg.chat.id;
    if (to === "menu") {
        return bot.editMessageText(formatText("Hey there"), {
            chat_id: chatId,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: menuInlineKeyboard,
            },
            parse_mode: "HTML",
        });
    }
};
