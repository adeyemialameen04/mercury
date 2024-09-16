import path from "path";
import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";
import { settings } from "../../config/constants";
import { generateReferralString } from "../../utils/referrals";

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

export const handleMenu = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, formatText("Hey there"), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: menuInlineKeyboard,
    },
  });
};

const noTokens = (msg: Message) => {
  return bot.editMessageText(
    formatText(
      "You do not have any tokens yet! Start trading in the Buy menu.",
    ),
    {
      chat_id: msg?.chat?.id,
      message_id: msg?.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: refreshAndBackBtns,
      },
    },
  );
};

const buy = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, "Enter how many stx you want to buy");
};

const sell = (msg: Message) => {
  return noTokens(msg);
};

const positions = (msg: Message) => {
  return noTokens(msg);
};

const referrals = (msg: Message) => {
  const chatId = msg.chat.id;
  const imagePath = path.resolve(__dirname, "../../public/s4vitar.png");
  const referral_link = `${settings.base_url}/${generateReferralString()}`;

  return bot.sendPhoto(
    chatId,
    "https://images.dog.ceo/breeds/mexicanhairless/n02113978_2261.jpg",
    {
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
    },
  );
};

const backOnly = (msg: Message, action: string) => {
  return bot.editMessageText(
    `You have no active ${action}. Create a ${action} from the Buy/Sell menu.`,
    {
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
    },
  );
};

const limit_orders = (msg: Message) => {
  return backOnly(msg, "limit order");
};

const dca_orders = (msg: Message) => {
  return backOnly(msg, "DCA order");
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
  //     {
  //   action: "",
  //   func: "",
  // },
];
