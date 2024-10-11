import styles from "./index.module.scss";


interface RatingSliderProps {
    value: number;
    onChange: (newVal: number) => void;
}
export function RatingSlider({ value, onChange }: RatingSliderProps) {
    return (<div className={styles["rating-slider"]}>
        <input type="range" list="markers" min="0" max="100" step="25"
               value={value*100} onChange={(ev) => onChange(ev.target.valueAsNumber/100.0)} />
        <datalist id="markers">
            <option value="0"   data-text="Bad"></option>
            <option value="25"  data-text="Eh"></option>
            <option value="50"  data-text="Alright"></option>
            <option value="75"  data-text="Pretty Good"></option>
            <option value="100" data-text="GOOD"></option>
        </datalist>
    </div>);
}
