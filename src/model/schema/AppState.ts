import {UUID} from "./UUID";
import {Food} from "./Food";
import {Restaurant} from "./Restaurant";
import {User} from "./User";


export interface AppState {
    curUserId?: UUID;
    users: User[];
    restaurants: Restaurant[];
    foods: Food[];
}
