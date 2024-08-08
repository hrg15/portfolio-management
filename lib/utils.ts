import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPairs } from "./endpoints/schemas";
import { CHAIN_ID, QUOTE_T0KEN } from "@/config";
// import { isValidNumber } from "./math";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const repeat = (times: number) => {
  return Array.from(Array(times).keys());
};

export const isProduction = () => {
  if (process && process.env.NODE_ENV === "development") {
    return false;
  }

  return true;
};

export const formatCurrency = (amount: number | string | undefined) => {
  if (!amount) return 0;
  if (typeof amount === "string") amount = +amount;
  return amount.toLocaleString();
};

export const formatCrypto = (amount: number | string | undefined) => {
  if (!amount) return 0;
  if (typeof amount === "string") amount = +amount;
  return amount.toString();
};

export function capitalize(text: string) {
  if (typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const IS_BROWSER = typeof window !== "undefined";

export const deepClone = (data: any) => JSON.parse(JSON.stringify(data));

function fixNumbers(str: string): string {
  const persianNumbers: RegExp[] = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicNumbers: RegExp[] = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];
  if (typeof str === "string") {
    for (let i = 0; i < 10; i++) {
      str = str
        .replace(persianNumbers[i], i.toString())
        .replace(arabicNumbers[i], i.toString());
    }
  }
  return str;
}

export const numberInputSanitizer = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (event: React.ChangeEvent<HTMLInputElement>) => void,
  precision?: number,
) => {
  event.target.value = fixNumbers(event.target.value);

  const value = event.target.value;

  if (value.length > 20 || value.split(".").length > 2) {
    return;
  }

  const validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

  for (const char of value) {
    if (!validChars.includes(char)) {
      return;
    }
  }

  if (value === "00") {
    return;
  }

  if (value.startsWith(".")) {
    event.target.value = "0.";
  }

  const decimalCount: undefined | number = value.split(".")[1]?.length;

  if (precision !== undefined && decimalCount && decimalCount > precision) {
    event.target.value = value.slice(0, precision - decimalCount);
  }

  callback(event);
};

export function getBigNumberAbbreviate(number: number, precision: number = 1) {
  const abbr = ["M", "B", "T"];

  let tier = (Math.log10(number) / 3) | 0;

  if (tier === 2) tier = 2;
  else if (tier < 2) return number;

  const suffix = abbr[tier - 2];
  const scale = Math.pow(10, tier * 3);

  const scaled = number / scale;

  return scaled.toFixed(precision) + suffix;
}

export function getDecimalCount(value: string | undefined): number | undefined {
  return value?.split(".")[1]?.length;
}

export function ellipsizeEmail(email: string) {
  const parts = email.split("@") as [string | undefined, string | undefined];
  if (!parts[0] || !parts[1]) {
    return "";
  }
  return `${parts[0]?.slice(0, 3)}...@${parts[1]}`;
}
export function ellipsizeAddress(address: string) {
  return `${address?.slice(0, 6)}...${address?.slice(-6)}`;
}

export const calculateChartMinMove = (precision: number) => {
  return +`0.${"0".repeat(Math.max(precision, 2) - 1)}1`;
};

export const calculateChartPrecision = (precision: number) => {
  return Math.max(precision, 2);
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function monthDate() {
  const currentDate = new Date();

  const lastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
  );
  const currentMonth = currentDate.getMonth();

  const lastMonthName = monthNames[lastMonth.getMonth()];
  const currentMonthName = monthNames[currentMonth];
  const currentYear = currentDate.getFullYear();

  const dateRange = `${lastMonthName} - ${currentMonthName}${currentYear}`;
  return dateRange;
}

export const filterTokenPairs = (pairs: IPairs[]) => {
  const filteredPairs = pairs.filter(
    (pair) =>
      pair.chainId === CHAIN_ID &&
      pair.dexId === "uniswap" &&
      pair.quoteToken.symbol === QUOTE_T0KEN,
  );

  // const groupedPairs: { [key: string]: IPairs } = {};
  // filteredPairs.forEach((pair) => {
  //   const key = `${pair.baseToken.address}-${pair.quoteToken.address}`;
  //   if (
  //     !groupedPairs[key] ||
  //     (pair.liquidity?.usd || 0) > (groupedPairs[key].liquidity?.usd || 0)
  //   ) {
  //     groupedPairs[key] = pair;
  //   }
  // });
  // return Object.values(groupedPairs).map((pair) => pair.pairAddress);
  return filteredPairs.map((pair) => pair.pairAddress);
};
