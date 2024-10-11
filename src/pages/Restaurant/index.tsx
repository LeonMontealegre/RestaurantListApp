import type {ActionFunction, LoaderFunction, SubmitOptions} from "react-router-dom";
import type {Food, User, Restaurant, UUID, Location} from "model/schema";

import {useState} from "react";
import {Outlet, redirect, useLoaderData, useNavigate, useSubmit as useSubmitRR} from "react-router-dom";

import {AddNewFood, GetCurUserId, GetFoodsFromRestaurant,
        GetRestaurant, GetUsers, RemoveRestaurant, ToggleFavoriteFood,
        ToggleFavoriteRestaurant} from "data/state";

import {ConfirmationPopup}   from "components/ConfirmationPopup";
import {ListEntry}           from "components/ListEntry";
import {RestaurantListEntry} from "components/ListEntry/RestaurantListEntry";
import {FoodListEntry}       from "components/ListEntry/FoodListEntry";
import {ListEntryHeader}     from "components/ListEntryHeader";
import {NewFoodPopup}        from "components/NewFoodPopup";

import styles     from "./index.module.scss";


type ActionType = {
    type: "newFood";
    food: Food;
} | {
    type: "delete";
    restaurantId: UUID;
} | ({
    type: "toggleFavorite";
    kind: "restaurant";
    restaurantId: UUID;
} | {
    type: "toggleFavorite";
    kind: "location" | "food";
    restaurantId: UUID;
    id: UUID;
})
interface LoaderType {
    restaurant: Restaurant;
    curUserId: UUID;
    foods: Food[];
    users: User[];
}

const useSubmit = (restaurantId: UUID) => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target), {
            method: "post",
            encType: "application/json",
            action: `/restaurants/${restaurantId}`,
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
    const foods = await GetFoodsFromRestaurant(restaurantId);
    const users = await GetUsers();
    const curUserId = (await GetCurUserId())!;
    return { restaurant, curUserId, foods, users };
}
export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "newFood") {
        await AddNewFood(action.food);
        return redirect("");
    }
    if (action.type === "delete") {
        await RemoveRestaurant(action.restaurantId);
        return redirect("/");
    }
    if (action.type === "toggleFavorite") {
        switch (action.kind) {
        case "food":
            await ToggleFavoriteFood(action.id);
            return redirect("");
        case "location":
            return redirect("");
        case "restaurant":
            await ToggleFavoriteRestaurant(action.restaurantId);
            return redirect("");
        }
    }
}


export default function RestaurantPage() {
    const { restaurant, curUserId, foods, users } = useLoaderData() as LoaderType;
    const [showPopup, setShowPopup] = useState(false);
    const [attemptedDelete, setAttemptedDelete] = useState(false);
    const submit = useSubmit(restaurant.id);
    const navigate = useNavigate();

    if (!restaurant)
        return null;

    const onNewLocationClick = () => {
    };

    const onRestaurantFavoriteClick = () => {
        submit({ type: "toggleFavorite", kind: "restaurant", restaurantId: restaurant.id });
    };
    const onFoodFavoriteClick = (food: Food) => {
        submit({ type: "toggleFavorite", kind: "food", restaurantId: restaurant.id, id: food.id });
    };
    const onLocationFavoriteClick = (loc: Location) => {
        submit({ type: "toggleFavorite", kind: "location", restaurantId: restaurant.id, id: "" });
    };

    const onInitialDeleteClick = () => setAttemptedDelete(true);
    const onConfirmedDeleteClick = () => {
        submit({ type: "delete", restaurantId: restaurant.id });
        setAttemptedDelete(false);
    };
    const onDeleteCancel = () => setAttemptedDelete(false);

    const onNewFoodClick = () => setShowPopup(true);
    const onFoodSubmit = (food: Food) => {
        submit({ type: "newFood", food });
        setShowPopup(false);
    };
    const onFoodClose = () => setShowPopup(false);

    return (<>
        <Outlet />

        {attemptedDelete &&
            <ConfirmationPopup text="Are you sure you want to delete this restaurant? (This cannot be undone)"
                onConfirm={onConfirmedDeleteClick}
                onCancel={onDeleteCancel} />}

        <div className={styles["restaurant-page"]}>
            {showPopup &&
                <NewFoodPopup
                    restaurantId={restaurant.id}
                    users={users}
                    onSubmit={onFoodSubmit}
                    onCancel={onFoodClose} />}

            <ListEntryHeader onDeleteClick={onInitialDeleteClick}>
                <RestaurantListEntry
                    restaurant={restaurant}
                    size="lg"
                    onFavoriteClick={onRestaurantFavoriteClick} />
            </ListEntryHeader>

            <div className={styles["restaurant-page__content"]}>
                <h2>Locations</h2>
                <button onClick={onNewLocationClick}>+ new location</button>
                {restaurant.locations.map((location) => (
                    <ListEntry
                        key={location.address}
                        isFavorite={false}
                        header={location.address}
                        link=""
                        onFavoriteClick={() => onLocationFavoriteClick(location)} />
                ))}
                <h2>Foods</h2>
                <button onClick={onNewFoodClick}>+ add food</button>
                {foods.map((food) => (
                    <FoodListEntry
                        key={food.id}
                        food={food}
                        curUserId={curUserId}
                        link
                        onFavoriteClick={() => onFoodFavoriteClick(food)} />))}
            </div>
        </div>
    </>);
}