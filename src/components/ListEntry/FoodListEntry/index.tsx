import {Food, Restaurant, User, UUID} from "model/schema";
import {ListEntry} from "..";

export interface FoodListEntryProps {
    food: Food;
    curUserId: UUID;
    restaurantName?: string;
    link?: boolean;
    size?: "sm" | "lg";
    onFavoriteClick?: () => void;
}
export function FoodListEntry({ food, restaurantName, curUserId, link, size, onFavoriteClick }: FoodListEntryProps) {
    const numRating = food.ratings?.[curUserId];
    const rating = numRating ? ["Bad", "Eh", "Alright", "Pretty Good", "GOOD"][numRating*4] : undefined;

    return (
        <ListEntry
            isFavorite={food.isFavorite}
            header={food.name}
            link={link ? `/foods/${food.id}` : undefined}
            size={size}
            onFavoriteClick={onFavoriteClick}>
            <span>{[restaurantName, rating ?? ""].filter(Boolean).join(" / ")}</span>
        </ListEntry>
    );
}
