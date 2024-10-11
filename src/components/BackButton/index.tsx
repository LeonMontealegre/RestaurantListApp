import {useNavigate} from "react-router-dom";

import styles     from "./index.module.scss";
import backIcon   from "./back_arrow.svg";


export function BackButton() {
    const navigate = useNavigate();

    return (
        <div className={styles["back-btn"]}>
            <img src={backIcon}
                    onClick={() => navigate(-1)} />
        </div>
    );
}
