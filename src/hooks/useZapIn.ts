import { useState } from "react";
import axios from "axios";
import { useWriteContract } from "wagmi";
import { Hex } from "viem";
import { ZapKyberABI } from "../lib/abis/ZapKyber";
import { provider } from "./provider";
import { CONTRACT_ADDRESSES } from "../constants";
import * as dn from "dnum";

interface ZapInResponse {
  amount0: string,
  amount1: string,
  mintAmount: string,
  swapAmount: string,
  swapFromToken: string,
  swapToToken: string,
  kyberSwapEncodedRoute: string,
};

export const useZapIn = () => {
  const [pendingToConfirm, setPendingToConfirm] = useState(false);

  const {
    data: hash,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();


  const zapIn = async (
    vaultAddress: Hex,
    inputToken: Hex,
    tokenInAmount: string
  ) => {
    try {
      setPendingToConfirm(true);

      const response = await axios.post<ZapInResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/zap-in`,
        {
          vaultAddress,
          inputToken,
          tokenInAmount,
        }
      );

      if (!response.data) {
        throw new Error("No data returned from Zap-In API.");
      }
      const result = response.data;
      if (
        !result.swapFromToken ||
        !result.mintAmount ||
        !result.kyberSwapEncodedRoute
      ) {
        throw new Error("Incomplete data returned from Zap-In API.");
      }

      const args = [
        vaultAddress,
        result.swapFromToken,
        BigInt(tokenInAmount),
        //95% of the mintAmount from result to be on the safe side for tx success
        dn.div(dn.mul(result.mintAmount,95),100)[0],
        result.kyberSwapEncodedRoute,
        result.kyberSwapEncodedRoute,
      ];

      const tx = await writeContractAsync({
        abi: ZapKyberABI,
        address: CONTRACT_ADDRESSES.zapContract,
        functionName: "zapIn",
        args,
      });

      const receipt = await provider.waitForTransaction(tx);
      setPendingToConfirm(false);

      return receipt;
    } catch (error) {
      console.error("Error in zapIn:", error);
      setPendingToConfirm(false);
      throw error;
    }
  };

  return {
    hash: hash,
    isPending: isTxCreating,
    isError: isCreationError,
    isConfirming: pendingToConfirm,
    zapIn,
  };
};
