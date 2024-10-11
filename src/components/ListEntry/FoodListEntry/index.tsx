import {Food, Restaurant, User, UUID} from "model/schema";
import {ListEntry} from "..";
import {Rating} from "components/Rating";

export interface FoodListEntryProps {
    food: Food;
    curUserId: UUID;
    restaurantName?: string;
    includeCategory?: boolean;
    link?: boolean;
    size?: "sm" | "lg";
    onFavoriteClick?: () => void;
}
export function FoodListEntry({ food, restaurantName, includeCategory, curUserId, link, size, onFavoriteClick }: FoodListEntryProps) {
    const numRating = food.ratings?.[curUserId];
    const rating = numRating !== undefined ? ["Bad", "Eh", "Alright", "Pretty Good", "GOOD"][numRating*4] : undefined;
    const color = numRating !== undefined ? ["#ff4545", "#ffa534", "#eebb34", "#97ee29", "#57cc29"][numRating*4] : "#999999";

    return (
        <ListEntry
            isFavorite={food.isFavorite}
            header={food.name}
            link={link ? `/foods/${food.id}` : undefined}
            size={size}
            onFavoriteClick={onFavoriteClick}>
            <Rating
                rating={numRating}
                otherInfo={restaurantName} />
            {includeCategory && food.category &&
                <span style={{
                    fontSize: (size === "sm" ? "10px" : "12px"),
                }}>
                    {food.category}
                </span>}
        </ListEntry>
    );
}
