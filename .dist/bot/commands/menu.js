import path from "path";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { settings } from "../../config/constants";
import { generateReferralString } from "../../utils/referrals";
import { BoldUnderline } from "../../utils/tags";
export const menuInlineKeyboard = [
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
];
const refreshAndBackBtns = [
    [
        {
            text: " 🔙 Back",
            callback_data: JSON.stringify({
                command: "back",
                action: "menu",
            }),
        },
        {
            text: "Refresh",
            callback_data: JSON.stringify({
                command: "refresh",
                action: "menu",
            }),
        },
    ],
];
export const handleMenu = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, formatText("Hey there"), {
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
const buy = (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, "Enter how many stx you want to buy");
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
    return bot.sendMessage(msg.chat.id, `<u><b>How do i use Mercury?</b></u>
Check out our <i><a href="https://youtube.com/mercury">Youtube Playlist</a></i>

${BoldUnderline("Which tokens can i trade?")}
Any STX token that is tradeable via stacks.js, including STX

${BoldUnderline("Where can i find my referral code?")}
Open the /start menu and click 💰 Referrals.

${BoldUnderline("My transaction timed out. What happened?")}
transaction timeouts can occur when there is heavy network load or instability. THis is simple the nature of the current Stacks network.

${BoldUnderline("What are the fees for using mercury?")}
Transactions through mercury incur a fee of 1%, or 0.9% if you were referred by another user. We don't charge a subscription fee or pay-wall any features.

${BoldUnderline("My net profit seems wrong, why is that?")}
The net profit of a trade takes into consideration the trade's transaction fees. Confirm the details of your trade on Stacks.io to verify the net profit.

${BoldUnderline("Additional questions or need support?")}
Join our Telegram group @mercury_on_stx_bot and one of our admins can assist you.
    `, {
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
