import { TokenItem } from "./Token";

export interface RouteData {
  routeSummary: RouteSummary;
  routerAddress: `0x${string}`;
  inputToken: TokenItem;
  outputToken: TokenItem;
}

export enum RouterMessageType {
  Succussful = "successfully",
}

export interface RouterApiResponse {
  code: number;
  message: string;
  data: RoutingData | BuildData;
  requestId?: string;
}

export interface RoutingData {
  routeSummary: RouteSummary;
  routerAddress:  `0x${string}`;
}

export interface RouteSummary {
  tokenIn: string;
  amountIn: string;
  amountInUsd: string;
  tokenInMarketPriceAvailable: boolean;
  tokenOut: string;
  amountOut: string;
  amountOutUsd: string;
  tokenOutMarketPriceAvailable: boolean;
  gas: string;
  gasPrice: string;
  gasUsd: string;
  extraFee: ExtraFee;
  route: Route[][];
}

export interface ExtraFee {
  feeAmount: string;
  chargeFeeBy: string;
  isInBps: boolean;
  feeReceiver: string;
}

export interface Route {
  pool: string;
  tokenIn: string;
  tokenOut: string;
  limitReturnAmount: string;
  swapAmount: string;
  amountOut: string;
  exchange: string;
  poolLength: number;
  poolType: string;
  poolExtra: PoolExtra | null;
  extra: Record<string, unknown>;
}

export interface PoolExtra {
  blockNumber: number;
}

export interface OutputChange {
  amount: string;
  percent: number;
  level: number;
}

export interface BuildData {
  amountIn: string;
  amountInUsd: string;
  amountOut: string;
  amountOutUsd: string;
  gas: string;
  gasUsd: string;
  outputChange: OutputChange;
  data: `0x${string}`;
  routerAddress: string;
}
