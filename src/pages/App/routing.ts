import type {SubmitOptions} from "react-router-dom";
import type {AppState, Food, Restaurant, User, UUID} from "model/schema";

import {useLoaderData as useLoaderDataRR, useSubmit as useSubmitRR} from "react-router-dom";


export type ActionType = {
    type: "newRestaurant";
    restaurant: Restaurant;
} | {
    type: "newUser";
    user: User;
} | {
    type: "changeUser";
    userId: UUID;
} | {
    type: "toggleFavorite";
    kind: "restaurant" | "food";
    id: UUID;
}
export interface LoaderType {
    curUserId?: UUID;
    users: User[];
    restaurants: Restaurant[];
    foods: Food[];
    restaurantNamesByFood: Map<UUID, string>;
}

export const useSubmit = () => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target),
               { method: "post", encType: "application/json", action: "/", ...(options ?? {}) });
};
export const useLoaderData = useLoaderDataRR as () => LoaderType;
