import localforage from "localforage";

import {AppState}   from "model/schema/AppState";
import {Food}       from "model/schema/Food";
import {Restaurant} from "model/schema/Restaurant";
import {User}       from "model/schema/User";
import {UUID}       from "model/schema/UUID";


class Table<T extends Record<string, any>> {
    private table: LocalForage;

    public constructor(dbName: string, tableName: string) {
        this.table = localforage.createInstance({ name: dbName, storeName: tableName });
    }

    public async getItem<K extends keyof T>(key: K): Promise<T[K] | undefined> {
        return await this.table.getItem<T[K]>(key as string) ?? undefined;
    }

    public async setItem<K extends keyof T>(key: K, val: T[K]): Promise<T[K]> {
        return await this.table.setItem(key as string, val);
    }

    public async removeItem<K extends keyof T>(key: K): Promise<void> {
        await this.table.removeItem(key as string);
    }

    public async values(): Promise<Array<T[keyof T]>> {
        return Promise.all((await this.table.keys())
            .map(async (k) => (await this.getItem(k))!));
    }

    public async entries(): Promise<Map<keyof T, T[keyof T]>> {
        const keys = await this.table.keys();
        const entries = await Promise.all(
            keys.map(async (k) =>
                [k, (await this.table.getItem(k))! as T[keyof T]] as const))
        return new Map(entries);
    }
}


interface AppConfig {
    curUserId: UUID;
}

const DB_NAME = "app";

const configTable         = new Table<AppConfig>               (DB_NAME, "config");
const usersTable          = new Table<Record<UUID, User>>      (DB_NAME, "users");
const restaurantsTable    = new Table<Record<UUID, Restaurant>>(DB_NAME, "restaurants");
const foodsTable          = new Table<Record<UUID, Food>>      (DB_NAME, "foods");
const foodIdsByRestaurant = new Table<Record<UUID, UUID[]>>    (DB_NAME, "foodsByRestaurant");


export async function GetRestaurant(id: UUID): Promise<Restaurant | undefined> {
    return await restaurantsTable.getItem(id);
}
export async function GetFood(id: UUID): Promise<Food | undefined> {
    return await foodsTable.getItem(id);
}

export async function GetRestaurants(): Promise<Restaurant[]> {
    return await restaurantsTable.values();
}
export async function GetRestaurantsAsMap(): Promise<Map<UUID, Restaurant>> {
    return await restaurantsTable.entries();
}
export async function GetFoods(): Promise<Food[]> {
    return await foodsTable.values();
}
export async function GetFoodsFromRestaurant(restaurantId: UUID): Promise<Food[]> {
    return await Promise.all((await foodIdsByRestaurant.getItem(restaurantId) ?? [])
        .map((fId) => foodsTable.getItem(fId) as Promise<Food>));
}
export async function GetUsers(): Promise<User[]> {
    return await usersTable.values();
}
export async function GetCurUserId(): Promise<UUID | undefined> {
    return await configTable.getItem("curUserId");
}

export async function AddNewRestaurant(restaurant: Restaurant): Promise<void> {
    await restaurantsTable.setItem(restaurant.id, restaurant);
    await foodIdsByRestaurant.setItem(restaurant.id, []);
}

// Adds user and sets it to be the current user
export async function AddNewUser(user: User): Promise<void> {
    await usersTable.setItem(user.id, user);
    await configTable.setItem("curUserId", user.id);
}

export async function ChangeCurUser(userId: UUID): Promise<void> {
    await configTable.setItem("curUserId", userId);
}

export async function AddNewFood(food: Food): Promise<void> {
    await foodsTable.setItem(food.id, food);
    await foodIdsByRestaurant.setItem(food.restaurantId,
        [...(await foodIdsByRestaurant.getItem(food.restaurantId))!, food.id]);
}

export async function RemoveRestaurant(restaurantId: UUID): Promise<void> {
    await restaurantsTable.removeItem(restaurantId);
    const foods = await foodIdsByRestaurant.getItem(restaurantId);
    await Promise.all(foods!.map((fId) => foodsTable.removeItem(fId)));
    await foodIdsByRestaurant.removeItem(restaurantId);
}

export async function RemoveFood(foodId: UUID): Promise<void> {
    await foodsTable.removeItem(foodId);
}

export async function EditRestaurant(restaurant: Restaurant): Promise<void> {
    await restaurantsTable.setItem(restaurant.id, restaurant);
}
export async function EditFood(food: Food): Promise<void> {
    await foodsTable.setItem(food.id, food);
}

export async function ToggleFavoriteRestaurant(restaurantId: UUID) {
    const restaurant = (await restaurantsTable.getItem(restaurantId))!;
    restaurantsTable.setItem(restaurantId, {
        ...restaurant,
        isFavorite: !restaurant.isFavorite,
    });
}

export async function ToggleFavoriteFood(foodId: UUID) {
    const food = (await foodsTable.getItem(foodId))!;
    foodsTable.setItem(foodId, {
        ...food,
        isFavorite: !food.isFavorite,
    });
}

// export async function ToggleFavoriteLocation(restaurantId: UUID, locationId: UUID) {
//     const restaurants = await localforage.getItem<Restaurant[]>("restaurants") ?? [];
//     await localforage.setItem("restaurants", restaurants.map((r) => (r.id === restaurantId ? {
//         ...r,
//         locations: r.locations.map((l) => (l.address === locationId ? ))
//     } : r)));
// }
