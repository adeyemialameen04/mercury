
import { bot } from "@/bot/bot";
import { generateNewWallet } from "@/services/wallet-generation";
import { BoldUnderline, Code } from "@/utils/tags";
import { Message } from "node-telegram-bot-api";

export const handleCreateNewWallet = async (msg: Message) => {
  const chatId = msg.chat.id;
  const walletInfo = await generateNewWallet("HelloPassword123") // Would implement getting password from user inoput later
  console.log(JSON.stringify(walletInfo, null, 2));


  return bot.sendMessage(chatId, `Wallet created successfully!

${BoldUnderline("⚠️ IMPORTANT")}: Write down your recovery phrase:

${Code(walletInfo.mnemonic)}.

Keep this phrase secret and safe. Anyone with these words can access your wallet!
${BoldUnderline("WALLET ADDRESS")}:  ${walletInfo.keyInfo.address}
`, {
    parse_mode: "HTML",
  });
};
