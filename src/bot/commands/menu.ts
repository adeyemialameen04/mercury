import { Message } from "node-telegram-bot-api";
import { bot } from "../bot";
import { formatText } from "../../utils/format_text";

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

export const handleMenu = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, formatText("Hey there"), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: menuInlineKeyboard,
    },
  });
};

const buy = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, "Enter how many stx you want to buy");
};

const sell = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(chatId, "Enter how many stx you want to send");
};

const positions = (msg: Message) => {
  const chatId = msg.chat.id;

  return bot.editMessageText(
    formatText(
      "You do not have any tokens yet! Start trading in the Buy menu.",
    ),
    {
      chat_id: chatId,
      message_id: msg.message_id,
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
            {
              text: "Refresh",
              callback_data: JSON.stringify({
                command: "refresh",
                action: "menu",
              }),
            },
          ],
        ],
      },
    },
  );
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
  //   {
  //   action: "",
  //   func: "",
  // },
];
