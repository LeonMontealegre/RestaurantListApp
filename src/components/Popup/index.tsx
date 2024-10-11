import styles from "./index.module.scss";


interface PopupProps {
    fullscreen?: boolean;
    children?: React.ReactNode;
    onClose: () => void;
}
export function Popup({ fullscreen, children, onClose }: PopupProps) {
    return (<div className={styles["screen-cover"]} onClick={onClose}>
        <div className={fullscreen ? styles["popup-fullscreen"] : styles["popup"]}
             onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>);
}