import {compareFoods, compareRestaurants, type Food, type Restaurant} from "model/schema";

import {Link, Outlet, useNavigate, useSearchParams} from "react-router-dom";

import {NewRestaurantPopup}           from "components/NewRestaurantPopup";
import {RestaurantListEntry}          from "components/ListEntry/RestaurantListEntry";

import {useLoaderData, useSubmit} from "../routing";

import styles from "./index.module.scss";
import settings from "./settings.svg";
import {FoodListEntry} from "components/ListEntry/FoodListEntry";


export function ListView() {
    const { curUserId, restaurants, foods, restaurantNamesByFood } = useLoaderData();
    const submit = useSubmit();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const onNewRestaurantClick = () => setSearchParams({
        ...searchParams,
        "p": "restaurant",
    });
    const onNewRestaurantSubmit = (restaurant: Restaurant) => {
        navigate("/", { replace: true });  // Makes it so that going back doesn't open the popup again
        submit({ type: "newRestaurant", restaurant });
    }
    const onNewRestaurantCancel = () => {
        navigate(-1);
    };

    const onRestaurantFavoriteClick = (restaurant: Restaurant) => {
        submit({ type: "toggleFavorite", kind: "restaurant", id: restaurant.id });
    };
    const onFoodFavoriteClick = (food: Food) => {
        submit({ type: "toggleFavorite", kind: "food", id: food.id });
    };

    const onFoodsListClick = () => setSearchParams({
        ...searchParams,
        "v": "foods",
    });
    const onRestaurantsListClick = () => {
        searchParams.delete("v");
        setSearchParams(searchParams);
    };

    const updateSearch = (newQuery: string) => {
        const isFirstSearch = (searchQuery == null);
        if (!newQuery) {
            searchParams.delete("q");
            setSearchParams(searchParams, { replace: true });
            return;
        }
        setSearchParams({
            ...searchParams,
            "q": newQuery,
        }, { replace: !isFirstSearch });
    };

    const showPopup = (searchParams.get("p") === "restaurant");
    const showRestaurants = (searchParams.get("v") !== "foods");
    const showFoods       = (searchParams.get("v") === "foods");

    const searchQuery = searchParams.get("q");

    return (
        <div className={styles["list-view-container"]}>
            <Outlet />

            {showPopup &&
                <NewRestaurantPopup
                    onSubmit={onNewRestaurantSubmit}
                    onCancel={onNewRestaurantCancel} />}

            <div className={styles["list-view-container__header"]}>
                <div className={styles["list-view-container__header__search-bar"]}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery ?? ""}
                        onChange={(ev) => updateSearch(ev.target.value)} />
                    <div className={styles["list-view-container__header__search-bar__settings"]}>
                        <Link to="/settings">
                            <img src={settings} />
                        </Link>
                    </div>
                </div>
                <div className={styles["list-view-container__header__btns"]}>
                    <button className={showRestaurants ? styles["active"] : ""} onClick={onRestaurantsListClick}>
                        restaurants
                    </button>
                    <button className={showFoods ? styles["active"] : ""} onClick={onFoodsListClick}>
                        foods
                    </button>
                </div>
            </div>
            <div className={styles["list-view-container__search-results"]}>
                {showRestaurants && Object.values(restaurants)
                    .sort(compareRestaurants(curUserId!))
                    .map((r) => (
                        <RestaurantListEntry key={r.id}
                            restaurant={r}
                            size="lg"
                            link
                            onFavoriteClick={() => onRestaurantFavoriteClick(r)} />
                    ))}
                {showFoods && Object.values(foods)
                    .sort(compareFoods(curUserId!))
                    .map((f) => (
                        <FoodListEntry key={f.id}
                            curUserId={curUserId!}
                            food={f}
                            restaurantName={restaurantNamesByFood.get(f.id)!}
                            size="lg"
                            link
                            onFavoriteClick={() => onFoodFavoriteClick(f)} />
                    ))}

                <button className={styles["list-view-container__new-restaurant-btn"]}
                    onClick={onNewRestaurantClick}>
                    +
                </button>
            </div>
        </div>
    );
}
