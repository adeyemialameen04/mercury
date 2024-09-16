import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { menuInlineKeyboard } from "../commands/menu";

export const handleBack = (msg: Message, to: string) => {
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
