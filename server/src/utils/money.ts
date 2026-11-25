export const PAISE_PER_RUPEE = 100;

export const MAX_BALANCE = 1_000_000_000;

export function isValidMoney(amount: number): boolean {
  return(
    Number.isSafeInteger(amount) &&
    amount >= 0 &&
    amount <= MAX_BALANCE
  );
}

export function rupeesToPaise(amount: string): number {
  const value = amount.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    throw new Error("Invalid rupee amount");
  }

  const [rupees, fraction = ""] = value.split(".");

  const paise =
    Number(rupees) * PAISE_PER_RUPEE +
    Number(fraction.padEnd(2, "0"));

  if (!isValidMoney(paise)) {
    throw new Error("Amount exceeds permitted limits");
  }

  return paise;
}

export function paiseToRupees(amount: number): number {
  if (!isValidMoney(amount)) {
    throw new Error("Invalid monetary amount");
  }

  return amount / PAISE_PER_RUPEE;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paiseToRupees(amount));
}