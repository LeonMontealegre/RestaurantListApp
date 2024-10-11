import type {ActionFunction, LoaderFunction, SubmitOptions} from "react-router-dom";
import type {Restaurant, UUID} from "model/schema";

import {redirect, useLoaderData, useNavigate, useSubmit as useSubmitRR} from "react-router-dom";

import {EditRestaurant, GetRestaurant} from "data/state";
import {NewRestaurantPopup} from "components/NewRestaurantPopup";


type ActionType = {
    type: "edit";
    restaurant: Restaurant;
}
interface LoaderType {
    restaurant: Restaurant;
}

const useSubmit = (restaurantId: UUID) => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target), {
            method: "post",
            encType: "application/json",
            action: `/restaurants/${restaurantId}/edit`,
            ...(options ?? {})
        });
};

export const Loader: LoaderFunction = async ({ params }): Promise<LoaderType | undefined> => {
    const restaurantId = params.restaurantId;
    if (!restaurantId)
        return;

    const restaurant = await GetRestaurant(restaurantId);
    if (!restaurant)
        return;
    return { restaurant };
}
export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "edit") {
        await EditRestaurant(action.restaurant);
        return redirect(`/restaurants/${action.restaurant.id}`);
    }
}

export default function EditRestaurantPage() {
    const { restaurant } = useLoaderData() as LoaderType;
    const submit = useSubmit(restaurant.id);
    const navigate = useNavigate();

    const onSubmit = (restaurant: Restaurant) => {
        submit({ type: "edit", restaurant }, { replace: true });
    };
    const onCancel = () => {
        navigate(-1);
    };

    return (
        <NewRestaurantPopup
            editMode
            initialRestaurant={restaurant}
            onSubmit={onSubmit}
            onCancel={onCancel} />
    );
}
