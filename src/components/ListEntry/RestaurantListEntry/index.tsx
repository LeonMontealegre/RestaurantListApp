import {Restaurant} from "model/schema";
import {ListEntry} from "..";
import {Rating} from "components/Rating";

export interface RestaurantListEntryProps {
    restaurant: Restaurant;
    link?: boolean;
    size?: "sm" | "lg";
    onFavoriteClick?: () => void;
}
export function RestaurantListEntry({ restaurant, link, size, onFavoriteClick }: RestaurantListEntryProps) {
    return (
        <ListEntry
            isFavorite={restaurant.isFavorite}
            header={restaurant.name}
            link={link ? `/restaurants/${restaurant.id}` : undefined}
            size={size}
            onFavoriteClick={onFavoriteClick}>
            <Rating
                rating={restaurant.rating}
                otherInfo={restaurant.cuisines.join(", ")} />
        </ListEntry>
    )
}
