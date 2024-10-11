import type {ActionFunction, LoaderFunction, SubmitOptions} from "react-router-dom";
import type {Food, User, UUID} from "model/schema";

import {redirect, useLoaderData, useNavigate, useSubmit as useSubmitRR} from "react-router-dom";

import {EditFood, GetFood, GetUsers} from "data/state";
import {NewFoodPopup} from "components/NewFoodPopup";


type ActionType = {
    type: "edit";
    food: Food;
}
interface LoaderType {
    food: Food;
    users: User[];
}

const useSubmit = (foodId: UUID) => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target), {
            method: "post",
            encType: "application/json",
            action: `/foods/${foodId}/edit`,
            ...(options ?? {})
        });
};

export const Loader: LoaderFunction = async ({ params }): Promise<LoaderType | undefined> => {
    const foodId = params.foodId;
    if (!foodId)
        return;

    const food = await GetFood(foodId);
    if (!food)
        return;
    const users = await GetUsers();
    return { food, users };
}
export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "edit") {
        await EditFood(action.food);
        return redirect(`/foods/${action.food.id}`);
    }
}

export default function EditFoodPage() {
    const { food, users } = useLoaderData() as LoaderType;
    const submit = useSubmit(food.id);
    const navigate = useNavigate();

    const onSubmit = (food: Food) => {
        submit({ type: "edit", food }, { replace: true });
    };
    const onCancel = () => {
        navigate(-1);
    };

    return (
        <NewFoodPopup
            editMode
            initialFood={food}
            restaurantId={food.restaurantId}
            users={users}
            onSubmit={onSubmit}
            onCancel={onCancel} />
    );
}
