import {Link} from "react-router-dom";

import styles from "./index.module.scss";
import star from "./star.svg";
import star_fill from "./star_fill.svg";



interface ListEntryProps {
    isFavorite: boolean;
    header: string;
    link?: string;
    children?: React.ReactNode;
    size?: "sm" | "lg";
    onFavoriteClick?: () => void;
}
export function ListEntry({ isFavorite, header, children, size, link, onFavoriteClick }: ListEntryProps) {
    return (<div className={styles["list-entry"]}>
        <div className={styles["list-entry__left"]}
             onClick={onFavoriteClick}>
            <span><img src={isFavorite ? star_fill : star} /></span>
        </div>
        <div className={styles["list-entry__content"]}>
            <div className={styles["list-entry__content__header"] + " " + styles[size ?? "sm"]}>
                {link ?
                    <Link to={link}>
                        {header}
                    </Link> :
                    <span>{header}</span>}
            </div>
            {children && <div className={styles["list-entry__content__info"]}>{children}</div>}
        </div>
    </div>);
}
