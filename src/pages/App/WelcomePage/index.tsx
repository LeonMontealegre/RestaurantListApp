import {useState}  from "react"
import {uuid}      from "model/schema";
import {useSubmit} from "../routing";

import styles from "./index.module.scss";


export function WelcomePage() {
    const [name, setName] = useState("");
    const submit = useSubmit();

    const onSubmit = () => {
        if (!name)
            return;

        submit({
            type: "newUser",
            user: {
                id: uuid(),
                name: name,
            },
        });
        setName("");
    }

    return (
        <div className={styles["welcome-page"]}>
            <h1>Welcome!</h1>
            <div>
                <h2>What's your name?</h2>
                <input type="text"
                    placeholder="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)} />
                <button type="button"
                    onClick={onSubmit}
                    disabled={(name.length === 0)}>Submit</button>
            </div>
        </div>
    );
}
