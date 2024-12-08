import path from "path";
import { bot } from "@/bot/bot";
import { settings } from "@/config/constants";
import { formatText } from "@/utils/format_text";
import { generateReferralString } from "@/utils/referrals";
import { menuInlineKeyboard, refreshAndBackBtns } from "@/bot/ui/menu";
import { referral } from "@/bot/html/referral";
import { stxCitybuy } from "./buy";
export const handleMenu = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, formatText("Hey there welcome to mercurey_on_stx, you asked for the menu so here it is!\nFeel free to look around i would wait."), {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: menuInlineKeyboard,
        },
    });
};
const noTokens = (msg) => {
    return bot.editMessageText(formatText("You do not have any tokens yet! Start trading in the Buy menu."), {
        chat_id: msg?.chat?.id,
        message_id: msg?.message_id,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: refreshAndBackBtns,
        },
    });
};
const buy = async (msg) => {
    const chatId = msg.chat.id;
    const senderKey = "";
    const stxAmount = 100000;
    const txId = await stxCitybuy(senderKey, stxAmount);
    bot.sendMessage(chatId, "Pending transaction: " + txId);
};
const sell = (msg) => {
    return noTokens(msg);
};
const positions = (msg) => {
    return noTokens(msg);
};
const referrals = (msg) => {
    const chatId = msg.chat.id;
    const imagePath = path.resolve(__dirname, "../../public/s4vitar.png");
    const referral_link = `${settings.base_url}/${generateReferralString()}`;
    return bot.sendPhoto(chatId, "https://i.ibb.co/Q80rr1M/s4vitar.png", {
        caption: ` 💰 <b>Invite your friends to save 10% on fees. If you've traded more than $10k volume in a week you'll receive a 35% share of the fees paid by your referrees! Otherwise, you'll receive a 25% share.
</b>

Your Referrals (updated every 15 min)
• Users referred: 0 (direct: 0, indirect: 0)
• Total rewards: 0 STX ($0.00)
• Total paid: 0 STX ($0.00)
• Total unpaid: 0 STX ($0.00)

Rewards are paid daily and airdropped directly to your chosen Rewards Wallet. <b><u>You must have accrued at least 0.00STX in unpaid fees to be eligible for a payout</u></b>

We've established a tiered referral system, ensuring that as more individuals come onboard, rewards extend through five different layers of users. This structure not only benefits community growth but also significantly increases the percentage share of fees for everyone.

Stay tuned for more details on how we'll reward active users and happy trading!

<b><u>Your Referral Link</u></b>
${referral_link}
`,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Close",
                        callback_data: JSON.stringify({
                            action: "close",
                        }),
                    },
                ],
                [
                    {
                        text: "Rewards Wallet: BXDP..velZ",
                        callback_data: JSON.stringify({
                            action: "change_referral_addr",
                        }),
                    },
                ],
                [
                    {
                        text: "Udate Your referral Link",
                        callback_data: JSON.stringify({
                            action: "close",
                        }),
                    },
                ],
            ],
        },
    });
};
const backOnly = (msg, action) => {
    return bot.editMessageText(`You have no active ${action}. Create a ${action} from the Buy/Sell menu.`, {
        chat_id: msg?.chat.id,
        message_id: msg?.message_id,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: " 🔙 Back",
                        callback_data: JSON.stringify({
                            command: "back",
                            action: "menu",
                        }),
                    },
                ],
            ],
        },
    });
};
const limit_orders = (msg) => {
    return backOnly(msg, "limit order");
};
const dca_orders = (msg) => {
    return backOnly(msg, "DCA order");
};
const help = (msg) => {
    return bot.sendMessage(msg.chat.id, referral, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: " 🔙 Back",
                        callback_data: JSON.stringify({
                            command: "back",
                            action: "menu",
                        }),
                    },
                ],
            ],
        },
    });
};
export const menuActions = [
    {
        action: "buy",
        func: buy,
    },
    {
        action: "sell",
        func: sell,
    },
    {
        action: "positions",
        func: positions,
    },
    {
        action: "referrals",
        func: referrals,
    },
    {
        action: "limit_orders",
        func: limit_orders,
    },
    {
        action: "dca_orders",
        func: dca_orders,
    },
    {
        action: "help",
        func: help,
    },
    //     {
    //   action: "",
    //   func: "",
    // },
];
