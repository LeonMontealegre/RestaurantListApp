import {configureStore} from "@reduxjs/toolkit";

import primaryUserReducer from "./PrimaryUser";
import usersReducer from "./Users";
import restaurantsReducer from "./Restaurants";
import foodsReducer from "./Foods";


export const store = configureStore({
    reducer: {
        primaryUser: primaryUserReducer,
        users: usersReducer,
        restaurants: restaurantsReducer,
        foods: foodsReducer,
    },
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<AppStore["getState"]>;
