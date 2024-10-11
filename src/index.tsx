import React from "react";
import {createRoot} from "react-dom/client";
import {createHashRouter, RouterProvider} from "react-router-dom"


import App, {Action as AppAction, Loader as AppLoader} from "pages/App";
import {ListView} from "pages/App/ListView";
import RestaurantPage, {Loader as RestaurantLoader, Action as RestaurantAction} from "pages/Restaurant";
import EditRestaurantPage, {Loader as EditRestaurantLoader, Action as EditRestaurantAction} from "pages/Restaurant/Edit";
import FoodPage, {Loader as FoodLoader, Action as FoodAction} from "pages/Food";
import EditFoodPage, {Loader as EditFoodLoader, Action as EditFoodAction} from "pages/Food/Edit";
import SettingsPage, {Action as SettingsAction} from "pages/Settings";

import * as serviceWorkerRegistration from "./serverWorkerRegistration";

import "./index.scss";


const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>error</div>,
        loader: AppLoader,
        action: AppAction,
        children: [
            {
                index: true,
                element: <ListView />,
                loader: AppLoader,
                action: AppAction,
            },
            {
                path: "restaurants/:restaurantId",
                element: <RestaurantPage />,
                loader: RestaurantLoader,
                action: RestaurantAction,
                children: [
                    {
                        path: "edit",
                        element: <EditRestaurantPage />,
                        loader: EditRestaurantLoader,
                        action: EditRestaurantAction,
                    },
                ],
            },
            {
                path: "foods/:foodId",
                element: <FoodPage />,
                loader: FoodLoader,
                action: FoodAction,
                children: [
                    {
                        path: "edit",
                        element: <EditFoodPage />,
                        loader: EditFoodLoader,
                        action: EditFoodAction,
                    },
                ],
            },
            {
                path: "settings",
                element: <SettingsPage />,
                action: SettingsAction,
            }
        ]
    },
]);

async function Init() {
    const container = document.getElementById("root")!;
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    );
}

Init();

serviceWorkerRegistration.register();
