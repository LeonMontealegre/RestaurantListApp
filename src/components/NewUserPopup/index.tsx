import type {User} from "model/schema";

import {useState} from "react";

import {uuid} from "model/schema/UUID";

import {CreationPopup} from "components/CreationPopup";

import styles from "./index.module.scss";


interface NewUserPopupProps {
    users: User[];
    onSubmit: (user: User) => void;
    onCancel: () => void;
}
export function NewUserPopup({ users, onCancel, onSubmit }: NewUserPopupProps) {
    const initialState = {};
    const [user, setUser] = useState<Partial<Omit<User, "id">>>(initialState);

    const doSubmit = () => {
        if (!user.name)
            return;
        // Can't have a duplicate name
        if (users.some((u) => (u.name === user.name)))
            return;

        onSubmit({
            id: uuid(),

            ...user,
            name: user.name,
        });

        setUser(initialState);  // reset state
    }
    const doCancel = () => {
        onCancel();
        setUser(initialState);  // reset state
    }

    const updateName = (newName: string) => setUser({
        ...user,
        name: newName,
    });


    return (<CreationPopup header="New User" onDone={doSubmit} onCancel={doCancel}>
        <input type="text"
            placeholder="name"
            value={user.name ?? ""}
            onChange={(ev) => updateName(ev.target.value)} />
    </CreationPopup>);
}
