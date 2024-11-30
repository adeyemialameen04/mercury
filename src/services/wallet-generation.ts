import { generateSecretKey, generateWallet, randomSeedPhrase } from "@stacks/wallet-sdk";
import {
  getAddressFromPrivateKey,
  privateKeyToPublic,
} from "@stacks/transactions";
import { Message } from "node-telegram-bot-api";
import { bot } from "../bot/bot";


export const generateNewWallet = async (password: string) => {
  const mnemonic = randomSeedPhrase();

  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: "",
  });
  const walletInfo = {
    mnemonic,
    keyInfo: {
      privateKey: wallet.accounts[0].stxPrivateKey,
      publicKey: privateKeyToPublic(wallet.accounts[0].stxPrivateKey),
      address: getAddressFromPrivateKey(
        wallet.accounts[0].stxPrivateKey,
        "testnet",
      ),
    },
  }
  return walletInfo
}

export const handleCreateWallet = async (msg: Message) => {
  const chatId = msg.chat.id;


  const password = "password"; // this should be the password the user provides

  const secretKey = generateSecretKey(128);

  // create a wallet object
  const wallet = await generateWallet({ secretKey, password });

  console.log(wallet);

  return bot.sendMessage(
    chatId,
    "Okay we are setting up a new wallet for you..",
  );
};

