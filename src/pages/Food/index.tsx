import type {ActionFunction, LoaderFunction, SubmitOptions} from "react-router-dom";
import type {Food, User, Restaurant, UUID} from "model/schema";

import {useState} from "react";
import {Outlet, redirect, useLoaderData, useSubmit as useSubmitRR} from "react-router-dom";

import {GetCurUserId, GetFood, GetFoods, GetRestaurant, GetUsers, RemoveFood, ToggleFavoriteFood, ToggleFavoriteRestaurant} from "data/state";

import {ConfirmationPopup} from "components/ConfirmationPopup";
import {FoodListEntry} from "components/ListEntry/FoodListEntry";
import {RestaurantListEntry} from "components/ListEntry/RestaurantListEntry";

import styles     from "./index.module.scss";
import deleteIcon from "./delete.svg";
import {ListEntryHeader} from "components/ListEntryHeader";


type ActionType = {
    type: "delete";
    foodId: UUID;
} | {
    type: "toggleFavorite";
    kind: "restaurant" | "food";
    id: UUID;
}
interface LoaderType {
    food: Food;
    curUserId: UUID;
    restaurants: Restaurant[];
    users: User[];
}

const useSubmit = (foodId: UUID) => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target), {
            method: "post",
            encType: "application/json",
            action: `/foods/${foodId}`,
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
    // Get all restaurants with foods that have the same name
    function AreApproximatelySameFood(a: Food, b: Food) {
        return (a.name.toLowerCase() === b.name.toLowerCase());
    }
    const restaurants = await Promise.all((await GetFoods())
        .filter((f) => AreApproximatelySameFood(food, f))
        .map((f) => GetRestaurant(f.restaurantId) as Promise<Restaurant>));
    // const restaurants = state.restaurants.filter((r) => (
    //     state.foods
    //         .filter((f) => (f.restaurantId === r.id))
    //         .some((f) => AreApproximatelySameFood(food, f))
    // ));
    const users = await GetUsers();
    const curUserId = (await GetCurUserId())!;
    return { food, curUserId, restaurants, users };
}
export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "delete") {
        await RemoveFood(action.foodId);
        return redirect("/");
    } else if (action.type === "toggleFavorite") {
        switch (action.kind) {
        case "food":
            await ToggleFavoriteFood(action.id);
            return redirect("");
        case "restaurant":
            await ToggleFavoriteRestaurant(action.id);
            return redirect("");
        }
    }
}


export default function FoodPage() {
    const { food, curUserId, restaurants, users } = useLoaderData() as LoaderType;
    const [attemptedDelete, setAttemptedDelete] = useState(false);
    const submit = useSubmit(food.id);

    if (!food)
        return null;

    const onInitialDeleteClick = () => setAttemptedDelete(true);
    const onConfirmedDeleteClick = () => {
        submit({ type: "delete", foodId: food.id });
        setAttemptedDelete(false);
    };
    const onDeleteCancel = () => setAttemptedDelete(false);

    const onFoodFavoriteClick = (food: Food) => {
        submit({ type: "toggleFavorite", kind: "food", id: food.id });
    };
    const onRestaurantFavoriteClick = (restaurant: Restaurant) => {
        submit({ type: "toggleFavorite", kind: "restaurant", id: restaurant.id });
    };

    const restaurant = restaurants.find((r) => (r.id === food.restaurantId))!;
    const otherRestaurants = restaurants.filter((r) => (r.id !== food.restaurantId));

    return (<>
        <Outlet />

        {attemptedDelete &&
            <ConfirmationPopup text="Are you sure you want to delete this food? (This cannot be undone)"
                onConfirm={onConfirmedDeleteClick}
                onCancel={onDeleteCancel} />}

        <div className={styles["food-page"]}>
            <ListEntryHeader onDeleteClick={onInitialDeleteClick}>
                <FoodListEntry
                    food={food}
                    curUserId={curUserId}
                    size="lg"
                    onFavoriteClick={() => onFoodFavoriteClick(food)} />
            </ListEntryHeader>

            <div className={styles["food-page__content"]}>
                <h2>From</h2>
                <RestaurantListEntry
                    restaurant={restaurant}
                    link
                    onFavoriteClick={() => onRestaurantFavoriteClick(restaurant)} />
                <h2>Other Restaurants</h2>
                {otherRestaurants
                    .map((restaurant) =>
                        <RestaurantListEntry
                            key={restaurant.id}
                            restaurant={restaurant}
                            link
                            onFavoriteClick={() => onRestaurantFavoriteClick(restaurant)} />)}
                {otherRestaurants.length === 0 &&
                    <div className={styles["food-page__content-none"]}>None</div>}
            </div>
        </div>
    </>);
}