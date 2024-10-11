import {Cuisine} from "./Cuisine";
import {Location} from "./Location";
import {Price} from "./Price";
import {UUID} from "./UUID";


export interface Restaurant {
    id: UUID;
    name: string;

    isFavorite: boolean;
    cuisines: Cuisine[];
    locations: Location[];
    rating?: number;
    price?: Price;
    notes?: string[];
}

export function compareRestaurants(curUserId: UUID){
    return function (a: Restaurant, b: Restaurant): number {
        if (a.isFavorite && !b.isFavorite)
            return -1;
        if (!a.isFavorite && b.isFavorite)
            return +1;
        return a.name.localeCompare(b.name);
    }
}
