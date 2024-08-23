import axios from "axios";
import { Chain } from "~/constants";
import { RouterApiResponse, RouteSummary, TokenItem } from "~/models";

const AGGREGATOR_KYBERSWAP_BASEURL = "https://aggregator-api.kyberswap.com";

const api = axios.create({
  baseURL: AGGREGATOR_KYBERSWAP_BASEURL,
  headers: { accept: "application/json" },
});

export default {
  router: {
    get: async (
      chain: Chain,
      tokenIn: TokenItem,
      amountIn: number,
      tokenOut: TokenItem
    ) => {
      const amountInFormatted = (
        amountIn *
        10 ** tokenIn.decimals
      ).toLocaleString("fullwide", { useGrouping: false });
      const targetPathConfig = {
        params: {
          tokenIn: tokenIn.address,
          tokenOut: tokenOut.address,
          amountIn: amountInFormatted,
          gasInclude: "true",
        },
      };
      return await api.get<RouterApiResponse>(
        `${chain.toLowerCase()}/api/v1/routes?${new URLSearchParams(
          targetPathConfig.params
        )}`
      );
    },
    build: async (
      chain: Chain,
      routeSummary: RouteSummary,
      address: string,
      slippage: number
    ) => {
      const requestBody = {
        routeSummary: routeSummary,
        sender: address,
        recipient: address,
        slippageTolerance: slippage,
      };
      console.log("requestBody:", requestBody);
      return await api.post<RouterApiResponse>(
        `/${chain}/api/v1/route/build`,
        JSON.stringify(requestBody)
      );
    },
  },
};
