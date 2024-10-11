import type {PayloadAction} from "@reduxjs/toolkit";

import {createSlice} from "@reduxjs/toolkit";

import {Restaurant} from "model/schema/Restaurant";
import {UUID, uuid} from "model/schema/UUID";


const r1ID = uuid();

export const initialState: Record<UUID, Restaurant> = {
    [r1ID]: {
        id: r1ID,
        isFavorite: false,
        name: "restaurant name",
        cuisines: ["Chinese"],
        locations: [
            {
                address: "326 Spruce St, Linden NJ",
            }
        ],
        rating: 4.5,
        notes: [],
    },
};

const restaurantsSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers: {
        addRestaurant: (state, { payload: restaurant }: PayloadAction<Restaurant>) => {
            state[restaurant.id] = restaurant;
        },
    },
});

export const { addRestaurant } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
