import type {ActionFunction, LoaderFunction, SubmitOptions} from "react-router-dom";

import {useRef, useState}  from "react"
import {Food, Restaurant, User, uuid} from "model/schema";

import {Outlet, redirect, useLoaderData, useSubmit as useSubmitRR} from "react-router-dom";

import styles from "./index.module.scss";
import {BackButton} from "components/BackButton";
import {ConfirmationPopup} from "components/ConfirmationPopup";
import {ClearAllData, GetFoods, GetRestaurants, GetUsers, LoadData} from "data/state";


type ActionType = {
    type: "reset";
} | {
    type: "load";
    foods: Food[];
    restaurants: Restaurant[];
    users: User[];
}

const useSubmit = () => {
    const submit = useSubmitRR();
    return (target: ActionType, options?: SubmitOptions) =>
        submit(JSON.stringify(target), {
            method: "post",
            encType: "application/json",
            action: `/settings`,
            ...(options ?? {})
        });
};

export const Action: ActionFunction = async ({ request, params }) => {
    const action = await request.json() as ActionType;

    if (action.type === "reset") {
        await ClearAllData();
        return redirect("/");
    } else if (action.type === "load") {
        await LoadData(action.foods, action.restaurants, action.users);
        return redirect("/");
    }
}

function LoadFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (!reader.result)
                throw new Error("LoadFile failed: reader.result is undefined");
            resolve(reader.result.toString());
        });
        reader.addEventListener("abort", () => reject("Failed to load file!"));
        reader.addEventListener("error", () => reject("Failed to load file!"));
        reader.readAsText(file);
    });
}

function CheckObjHasTypes(obj: object, schema: Record<string, "string" | "number" | "boolean" | "object">): boolean {
    return Object.entries(schema)
        .every(([key, type]) => {
            const isOptional = key.endsWith("?");
            if (!(key in obj))
                return isOptional;
            const val = (obj as Record<typeof key, unknown>)[key];
            return (typeof val === type);
        });
}

function VerifyFoods(foods: unknown[]): foods is Food[] {
    function VerifyFood(food: unknown): food is Food {
        if (!food)
            return false;
        if (typeof food !== "object")
            return false;
        return CheckObjHasTypes(food, {
            "restaurantId": "string",
            "id": "string",

            "name": "string",
            "alternateNames?": "object",

            "isFavorite": "boolean",
            "ratings?": "object",
            "category?": "string",
            "notes?": "object",
            "specialInstructions?": "object",
        });
    }
    return foods.every(VerifyFood);
}
function VerifyRestaurants(restaurants: unknown[]): restaurants is Restaurant[] {
    function VerifyRestaurant(restaurant: unknown): restaurant is Restaurant {
        if (!restaurant)
            return false;
        if (typeof restaurant !== "object")
            return false;
        return CheckObjHasTypes(restaurant, {
            "id": "string",
            "name": "string",

            "isFavorite": "boolean",
            "cuisines": "object",
            "locations": "object",
            "rating?": "number",
            "price?": "number",
            "notes?": "object",
        });
    }
    return restaurants.every(VerifyRestaurant);
}
function VerifyUsers(users: unknown[]): users is User[] {
    function VerifyUser(user: unknown): user is User {
        if (!user)
            return false;
        if (typeof user !== "object")
            return false;
        return CheckObjHasTypes(user, {
            "id": "string",
            "name": "string",
        });
    }
    return users.every(VerifyUser);
}

export default function SettingsPage() {
    const submit = useSubmit();
    const [attemptedDelete, setAttemptedDelete] = useState(false);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const onImportDataClick = () => {
        inputFile.current?.click();
    };
    const onImportDataChoose = async (file: File) => {
        const fileContents = await LoadFile(file);
        const data = JSON.parse(fileContents);
        if (!("foods" in data) || !("restaurants" in data) || !("users" in data))
            throw new Error("Data in wrong format! " + data);
        const { foods, restaurants, users } = data;
        if (!Array.isArray(foods) || !Array.isArray(restaurants) || !Array.isArray(users))
            throw new Error("Data in wrong format! " + data);
        if (!VerifyFoods(foods) || !VerifyRestaurants(restaurants) || !VerifyUsers(users))
            throw new Error("Data in wrong format! " + data);
        submit({ type: "load", foods, restaurants, users });
    };
    const onExportDataClick = async () => {
        const foods = await GetFoods();
        const restaurants = await GetRestaurants();
        const users = await GetUsers();
        const data = JSON.stringify({
            foods,
            restaurants,
            users
        });

        const filename = "restaurant-list-data.json";
        const file = new Blob([data], { type: "text/json" });
        const url = URL.createObjectURL(file);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.append(a);
        a.click();
        setTimeout(() => {
            a.remove();
            window.URL.revokeObjectURL(url);
        }, 0);
    };
    const onClearAllDataClick = () => {
        setAttemptedDelete(true);
    };
    const onConfirmClearAllDataClick = () => {
        submit({ type: "reset" });
        setAttemptedDelete(false);
    };
    const onCancelClearAllDataClick = () => {
        setAttemptedDelete(false);
    };

    return (
        <div className={styles["settings-page"]}>
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                accept=".json"
                multiple={false}
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0)
                        onImportDataChoose(e.target.files![0]);
                }} />

            {attemptedDelete &&
                <ConfirmationPopup
                    text="Are you sure want to delete ALL of your data? (This cannot be undone)"
                    onConfirm={onConfirmClearAllDataClick}
                    onCancel={onCancelClearAllDataClick} />}

            <h1><BackButton /> Settings</h1>
            <div>
                <button onClick={onImportDataClick}>Import Data</button>
                <button onClick={onExportDataClick}>Export Data</button>
                <button onClick={onClearAllDataClick}>Clear All Data</button>
            </div>
        </div>
    );
}
