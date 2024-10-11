import type {PayloadAction} from "@reduxjs/toolkit";

import {createSlice} from "@reduxjs/toolkit";

import {User} from "model/schema/User";
import {UUID, uuid} from "model/schema/UUID";


const u1ID = uuid();
const u2ID = uuid();

export const initialState: Record<UUID, User> = {
    [u1ID]: {
        id: u1ID,
        name: "Leon",
    },
    [u2ID]: {
        id: u2ID,
        name: "Katherine",
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser: (state, { payload: user }: PayloadAction<User>) => {
            state[user.id] = user;
        },
    },
});

export const { addUser } = usersSlice.actions;

export default usersSlice.reducer;
