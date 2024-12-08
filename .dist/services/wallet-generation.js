import { generateSecretKey, generateWallet } from "@stacks/wallet-sdk";
import { getAddressFromPrivateKey } from "@stacks/transactions";
export const generateNewWallet = async (password) => {
  const mnemonic = generateSecretKey();
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: password,
  });
  console.log(wallet);
  const walletInfo = {
    mnemonic,
    keyInfo: {
      privateKey: wallet.accounts[0].stxPrivateKey,
      address: getAddressFromPrivateKey(
        wallet.accounts[0].stxPrivateKey,
        "testnet"
      ),
    },
  };
  return walletInfo;
};
