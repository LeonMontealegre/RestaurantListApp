import {Category} from "./Category";
import {UUID} from "./UUID";


export interface Food {
    restaurantId: UUID;
    id: UUID;

    name: string;
    alternameNames?: string[];

    isFavorite: boolean;
    ratings?: Record<UUID, number>;
    category?: Category;
    notes?: string[];
    specialInstructions?: string[];
}

export function compareFoods(curUserId: UUID){
    return function (a: Food, b: Food): number {
        if (a.isFavorite && !b.isFavorite)
            return -1;
        if (!a.isFavorite && b.isFavorite)
            return +1;
        // Unrated should be sorted slightly under average
        const aRating = a.ratings?.[curUserId] ?? 0.4;
        const bRating = b.ratings?.[curUserId] ?? 0.4;
        if (aRating !== bRating)
            return -(aRating - bRating);  // Invert since high ratings should appear higher
        return a.name.localeCompare(b.name);
    }
}
