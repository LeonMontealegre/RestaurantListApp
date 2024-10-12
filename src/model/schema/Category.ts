
export const CATEGORIES = [
    "Appetizer",
    "Main",
    "Side",
    "Drink",
    "Combo",
    "Dessert",
] as const;

export type Category = typeof CATEGORIES[number];
