import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
export const handleMenu = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, 
    // "myMessage                           (lots of spaces)                       &#x200D;",
    formatText("Hey there"), {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Buy",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "buy",
                        }),
                    },
                    {
                        text: "Sell",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "sell",
                        }),
                    },
                ],
                [
                    {
                        text: "Positions",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "positions",
                        }),
                    },
                    {
                        text: "Limit Orders",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "limit_orders",
                        }),
                    },
                    {
                        text: "DCA Orders",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "dca_orders",
                        }),
                    },
                ],
                [
                    {
                        text: "Copy Trade",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "copy_trade",
                        }),
                    },
                    {
                        text: "LP Sniper 🔜",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "lp_sniper",
                        }),
                    },
                ],
                [
                    {
                        text: "New Pairs",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "new_pairs",
                        }),
                    },
                    {
                        text: " 💰 Referrals",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "referrals",
                        }),
                    },
                    {
                        text: "Settings",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "settings",
                        }),
                    },
                ],
                [
                    {
                        text: "Bridge",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "bridge",
                        }),
                    },
                    {
                        text: "Withdraw",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "withdraw",
                        }),
                    },
                ],
                [
                    {
                        text: "Help",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "help",
                        }),
                    },
                    {
                        text: "Refresh",
                        callback_data: JSON.stringify({
                            command: "menu",
                            action: "refresh",
                        }),
                    },
                ],
            ],
        },
    });
};
