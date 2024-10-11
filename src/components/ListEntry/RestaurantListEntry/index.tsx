import {Restaurant} from "model/schema";
import {ListEntry} from "..";

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
            {[
                restaurant.cuisines.join(", "),
                restaurant.rating ?? ""
            ]
            .filter(Boolean)
            .join(" / ")}
        </ListEntry>
    )
}
