import {Form} from "react-router-dom";

import {Popup} from "components/Popup";

import styles from "./index.module.scss";


interface CreationPopupProps {
    header: string;
    fullscreen?: boolean;
    children?: React.ReactNode;
    onDone: () => void;
    onCancel: () => void;
}
export function CreationPopup({ header, fullscreen, children, onDone, onCancel }: CreationPopupProps) {
    return (<Popup fullscreen={fullscreen} onClose={onCancel}>
        <div className={styles["creation-popup__header"]}>
            <h1>{header}</h1>
        </div>
        <div className={styles["creation-popup__content"]}>
            {children}
        </div>
        <div className={styles["creation-popup__footer"]}>
            <button type="button"
                    className={styles["creation-popup__footer__cancel"]}
                    onClick={onCancel}>
                Cancel
            </button>
            <button type="submit"
                    className={styles["creation-popup__footer__done"]}
                    onClick={onDone}>
                Done
            </button>
        </div>
    </Popup>)
}