import * as dn from "dnum";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ETH_TO_USD_CONVERSION_API } from "~/constants/configs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBigIntegers(num:number) {
  return num < 1 ? num.toFixed(6) : num < 9 ? num.toFixed(4) : num.toFixed(2)
}

export function truncateValues(val:any) {
  return `${val.slice(0,4)}...${val.slice(-4)}`
}

export function thousandSeperator(val:number) {
  return val ? Number(val).toLocaleString("en-US", { useGrouping: true }) : "";  
}

export const usdConverter = async (weiVal:bigint | undefined) => {
  const response = await fetch(ETH_TO_USD_CONVERSION_API);
  const data = await response.json();
  
  const ethVal = data.ethereum.usd
  
  const ethConversion = 1e18;
  const amountInEther = Number(weiVal)/ethConversion;
  
  return amountInEther*ethVal;

}

export function formatStringUnits(display: string, decimals: number) {
  const negative = display?.startsWith("-");
  if (negative) display = display.slice(1);

  display = display?.padStart(decimals, "0");

  let [integer, fraction] = [
    display?.slice(0, display.length - decimals),
    display?.slice(display.length - decimals),
  ];
  fraction = fraction?.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
}

export function tickToPrice(tick: number) {
  return Math.pow(1.0001, tick);
}

export function formatPrice(price: number) {
  const lowerThreshold = 1e-9; // Close enough to zero
  const upperThreshold = 1e9; // Close enough to infinity

  if (price < lowerThreshold) {
    return "0";
  } else if (price > upperThreshold) {
    return "∞";
  } else {
    return price.toFixed(2);
  }
}

export function formatNumber(
  value: string | number | dn.Dnum,
  options?: {
    decimalDigits?: number;
    compact?: boolean;
  }
) {
  const dnValue = dn.isDnum(value) ? value : dn.from(value);
  return dn.format(dnValue, { 
    digits: options?.decimalDigits ?? 2, 
    compact: options?.compact ?? false, 
    locale: "en" 
  });
}

