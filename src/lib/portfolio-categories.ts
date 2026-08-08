/** Shared portfolio / media categories */
export const PORTFOLIO_CATEGORIES = [
  "Fashion",
  "Food",
  "Luxury",
  "Beauty",
  "Real Estate",
  "D2C",
  "Work",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export const PORTFOLIO_FILTERS = ["All", ...PORTFOLIO_CATEGORIES] as const;

export const PORTFOLIO_PREVIEW_COUNT = 6;
export const ADMIN_MEDIA_PREVIEW_COUNT = 9;

export function isPortfolioCategory(value: string): value is PortfolioCategory {
  return (PORTFOLIO_CATEGORIES as readonly string[]).includes(value);
}
