import {Link, useNavigate} from "react-router-dom";

import styles     from "./index.module.scss";
import deleteIcon from "./delete.svg";
import editIcon   from "./edit.svg";
import backIcon   from "./back_arrow.svg";


interface ListEntryHeader {
    children: React.ReactNode;
    onDeleteClick: () => void;
}
export function ListEntryHeader({ children, onDeleteClick }: ListEntryHeader) {
    const navigate = useNavigate();

    return (
        <div className={styles["header"]}>
            <div>
                <div className={styles["header__back-btn"]}>
                    <img src={backIcon}
                            onClick={() => navigate(-1)} />
                </div>
                {children}
            </div>
            <div className={styles["header__right"]}>
                <Link to="edit">
                    <img src={editIcon} />
                </Link>
                <img src={deleteIcon} onClick={onDeleteClick} />
            </div>
        </div>
    );
}
