import type {User} from "model/schema";

import {useNavigate, useSearchParams} from "react-router-dom";
import {NewUserPopup}                 from "components/NewUserPopup";
import {useLoaderData, useSubmit}     from "../routing";

import styles from "./index.module.scss";


export function UserList() {
    const { curUserId, users } = useLoaderData();
    const submit = useSubmit();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const curUser = users.find((u) => (u.id === curUserId)) ?? users[0];

    const onUserSelect = (val: string) => {
        const newUser = users.find((u) => (u.id === val));
        if (!newUser)
            return;
        if (newUser.id === curUser.id)
            return;
        submit({ type: "changeUser", userId: newUser.id }, { navigate: false });
    };
    const onNewUserClick = () => setSearchParams({
        ...searchParams,
        "p": "user",
    });
    const onNewUserSubmit = (user: User) => {
        navigate("/", { replace: true });  // Makes it so that going back doesn't open the popup again
        submit({ type: "newUser", user });
    };
    const onNewUserCancel = () => {
        navigate(-1);
    };
    const showPopup = (searchParams.get("p") === "user");

    return (<div className={styles["user-list-container"]}>
        {showPopup &&
            <NewUserPopup
                users={users}
                onSubmit={onNewUserSubmit}
                onCancel={onNewUserCancel} />}

        User: <select value={curUser.id}
            onChange={(ev) => {
                if (ev.target.value === "new") {
                    onNewUserClick();
                } else {
                    onUserSelect(ev.target.value);
                }
            }}>
            {users.map((u) => (
                <option key={u.name} value={u.id}>{u.name}</option>
            ))}
            <option value="new">+ User</option>
        </select>
    </div>)
}
