import type {PayloadAction} from "@reduxjs/toolkit";

import {createSlice} from "@reduxjs/toolkit";

import {Food} from "model/schema/Food";
import {UUID, uuid} from "model/schema/UUID";

import {initialState as initialRestaurants} from "./Restaurants";
import {initialState as initialPrimayUser} from "./PrimaryUser";


const f1ID = uuid();

const initialState: Record<UUID, Food> = {
    [f1ID]: {
        restaurantId: Object.keys(initialRestaurants)[0],
        id: f1ID,

        name: "General Tso's Chicken",
        alternameNames: [],

        isFavorite: true,
        ratings: {
            [initialPrimayUser]: 1,
        },
        category: "Main",
        notes: [],
        specialInstructions: ["Get less spicy"]
    }
};

const foodsSlice = createSlice({
    name: "foods",
    initialState,
    reducers: {
        addFood: (state, { payload: food }: PayloadAction<Food>) => {
            state[food.id] = food;
        },
    },
});

export const { addFood } = foodsSlice.actions;

export default foodsSlice.reducer;
