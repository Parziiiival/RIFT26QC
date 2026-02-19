export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getRiskColor(score: number): string {
  if (score >= 75) return "risk-critical";
  if (score >= 50) return "risk-high";
  if (score >= 25) return "risk-medium";
  return "risk-low";
}

export function getRiskLabel(score: number): string {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

export function getGlowClass(score: number): string {
  if (score >= 75) return "glow-critical";
  if (score >= 50) return "glow-high";
  if (score >= 25) return "glow-medium";
  return "glow-low";
}
