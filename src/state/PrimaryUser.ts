import type {PayloadAction} from "@reduxjs/toolkit";

import {createSlice} from "@reduxjs/toolkit";

import {UUID} from "model/schema/UUID";

import {initialState as initialUsers} from "./Users";


export const initialState: UUID = Object.keys(initialUsers)[0];

const primaryUserSlice = createSlice({
    name: "primaryUser",
    initialState,
    reducers: {

    },
});

export const { } = primaryUserSlice.actions;

export default primaryUserSlice.reducer;
