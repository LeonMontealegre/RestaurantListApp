import {Form} from "react-router-dom";

import {Popup} from "components/Popup";

import styles from "./index.module.scss";


interface ConfirmationPopupProps {
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
}
export function ConfirmationPopup({ text, onConfirm, onCancel }: ConfirmationPopupProps) {
    return (<Popup onClose={onCancel}>
        <div className={styles["confirmation-popup__header"]}>
            <h1>{text}</h1>
        </div>
        <div className={styles["confirmation-popup__footer"]}>
            <button type="button"
                    className={styles["confirmation-popup__footer__yes"]}
                    onClick={onConfirm}>
                Yes
            </button>
            <button type="submit"
                    className={styles["confirmation-popup__footer__no"]}
                    onClick={onCancel}>
                No
            </button>
        </div>
    </Popup>)
}