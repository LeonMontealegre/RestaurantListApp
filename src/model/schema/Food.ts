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
