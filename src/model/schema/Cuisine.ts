
export const CUISINES = [
    "American",
    "Chinese",
    "Indian",
    "Japanese",
    "Viatnamese",
] as const;

export type Cuisine = typeof CUISINES[number];
