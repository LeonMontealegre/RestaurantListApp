
export const CATEGORIES = [
    "Appetizer",
    "Main",
    "Side",
    "Drink",
    "Combo",
] as const;

export type Category = typeof CATEGORIES[number];
