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
