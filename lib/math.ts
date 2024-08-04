import Big from "big.js";

export const sum = (num1: string | number, num2: string | number) =>
  new Big(num1).add(num2).toString();

export const minus = (num1: string | number, num2: string | number) =>
  new Big(num1).minus(num2).toString();

export const times = (num1: string | number, num2: string | number) =>
  new Big(num1).times(num2).toString();

export const divide = (num1: string | number, num2: string | number) =>
  new Big(num1).div(num2).toString();

export const roundUp = (num: string, decimal: number = 5) =>
  new Big(num).round(decimal, Big.roundUp).toString();

export const roundDown = (num: string | number, decimal: number = 5) =>
  new Big(num).round(decimal, Big.roundDown).toString();

export const calculateProportion = (num: string | number, percent: number) =>
  times(divide(num + "", "100"), percent + "").toString();

export const calculateApproximatePercentage = (
  num1: string | undefined,
  num2: string | undefined,
) => {
  if (!isGreaterThanZero(num1) || !isGreaterThanZero(num2) || !num1 || !num2)
    return "0";

  return Math.round(+times(divide(num1, num2), "100").toString());
};

export const isGreaterThanZero = (num: number | string | null | undefined) => {
  if (!num) return false;

  try {
    return new Big(num).gt(0);
  } catch (error) {
    return false;
  }
};

export const isValidNumber = (num: number | string | undefined | null) => {
  if (!num) return false;
  try {
    new Big(num).add(1);
    return true;
  } catch (error) {
    return false;
  }
};

export const isGrater = (num1: string, num2: string): boolean => {
  return new Big(num1).gt(num2);
};
