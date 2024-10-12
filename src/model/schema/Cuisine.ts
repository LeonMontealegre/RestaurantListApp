
export const CUISINES = [
    "American",
    "Chinese",
    "Indian",
    "Japanese",
    "Viatnamese",
    "Italian",
    "Thai",
    "Mexican",

    "Coffee",
    "Soup",
    "Smoothie",
    "Fast Food",
    "Pizza",
    "Asian",
    "Sandwiches",
    "Diner",
    "Breakfast",
] as const;

export type Cuisine = typeof CUISINES[number];
