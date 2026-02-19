import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K"
  }
  return num.toFixed(0)
}

export function getRiskColor(riskScore: number): string {
  if (riskScore >= 80) return "danger"
  if (riskScore >= 60) return "warning"
  if (riskScore >= 40) return "accent"
  return "success"
}

export function getRiskColorHex(riskScore: number): string {
  if (riskScore >= 80) return "#ff4444"
  if (riskScore >= 60) return "#ffaa00"
  if (riskScore >= 40) return "#00d9ff"
  return "#44ff44"
}
