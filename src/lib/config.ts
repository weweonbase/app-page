"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { fallback, webSocket } from "viem";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

export const projectId = "db99d4d311764dbfb7e4563ce13e71fb";

if (!projectId) throw new Error("Project ID is not defined");

const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        phantomWallet,
      ],
    },
  ],
  { appName: "WEWE App", projectId }
);

export const config = createConfig({
  chains: [base],
  connectors,
  ssr: true,
  transports: {
    [base.id]: fallback([
      http(process.env.NEXT_PUBLIC_RPC_URL),
      webSocket(process.env.NEXT_PUBLIC_RPC_URL?.replace("https://", "wss://")),
    ]),
  },
});
