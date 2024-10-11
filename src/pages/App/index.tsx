import type {ActionFunction, LoaderFunction} from "react-router-dom";

import {useState}                     from "react"
import {Link, Outlet, redirect} from "react-router-dom";
import {AddNewRestaurant, AddNewUser,
        ChangeCurUser,
        GetCurUserId,
        GetFoods,
        GetRestaurantsAsMap,
        GetUsers,
        ToggleFavoriteFood,
        ToggleFavoriteRestaurant}      from "data/state";
import {UserList}                     from "./UserList";
import {WelcomePage}                  from "./WelcomePage";
import {ActionType, LoaderType,
        useLoaderData}     from "./routing";

import styles from "./index.module.scss";
import {UUID} from "model/schema";


export const Loader: LoaderFunction = async ({ request }): Promise<LoaderType> => {
    const foods = await GetFoods();
    const users = await GetUsers();
    const curUserId = await GetCurUserId();

    const restaurantsMap = await GetRestaurantsAsMap();
    const restaurantNamesByFood = new Map(foods.map((f) => [f.id, restaurantsMap.get(f.restaurantId)!.name] as const));

    const restaurants = [...restaurantsMap.values()];
    return { curUserId, users, restaurants, foods, restaurantNamesByFood };
}
export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "newUser") {
        await AddNewUser(action.user);
        return redirect("/");
    } else if (action.type === "changeUser") {
        await ChangeCurUser(action.userId);
        return new Response();  // Ok
    } else if (action.type === "newRestaurant") {
        await AddNewRestaurant(action.restaurant);
        return redirect(`/restaurants/${action.restaurant.id}`);
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

export default function App() {
    const [view, setView] = useState<"List" | "Map">("List");
    const { users } = useLoaderData();

    // No user, first time opening app
    if (users.length === 0) {
        return <WelcomePage />;
    }

    return (
        <div className={styles["app-container"]}>
            <div className={styles["app-container__header"]}>
                <UserList />
            </div>
            <div className={styles["app-container__content"]}>
                <Outlet />
            </div>
            {/* <div className={styles["app-container__footer"]}>
                <div><Link to="/">List</Link></div>
                <div><Link to="/">Map</Link></div>
            </div> */}
        </div>
    );
}
