import {useState} from "react";

import {uuid} from "model/schema/UUID";
import {Restaurant} from "model/schema/Restaurant";
import {Cuisine, CUISINES} from "model/schema/Cuisine";
import {Price} from "model/schema/Price";

import {CreationPopup} from "components/CreationPopup";

import styles from "./index.module.scss"


interface PriceSliderProps {
    value: number;
    onChange: (newVal: number) => void;
}
function PriceSlider({ value, onChange }: PriceSliderProps) {
    return (<div className={styles["restaurant-pricing__slider"]}>
        <input type="range" list="markers" min="0" max="100" step="25"
               value={value*100} onChange={(ev) => onChange(ev.target.valueAsNumber/100.0)} />
        <datalist id="markers">
            <option value="0"   data-text="$"></option>
            <option value="25"  data-text="$$"></option>
            <option value="50"  data-text="$$$"></option>
            <option value="75"  data-text="$$$$"></option>
            <option value="100" data-text="$$$$$"></option>
        </datalist>
    </div>);
}

type NewRestaurantPopupProps = {
    onSubmit: (restaurant: Restaurant) => void;
    onCancel: () => void;
} & ({
    editMode?: false;
} | {
    editMode: true;
    initialRestaurant: Restaurant;
})
export function NewRestaurantPopup({ onSubmit, onCancel, ...props }: NewRestaurantPopupProps) {
    const initialState = props.editMode ? props.initialRestaurant : {};
    const [restaurant, setRestaurant] = useState<Partial<Omit<Restaurant, "id">>>(initialState);

    const doSubmit = () => {
        if (!restaurant.name)
            return;

        onSubmit({
            id: uuid(),

            ...restaurant,
            name: restaurant.name,
            cuisines: restaurant.cuisines ?? [],
            locations: restaurant.locations ?? [],
            isFavorite: restaurant.isFavorite ?? false,
        });

        setRestaurant(initialState);  // reset state
    }
    const doCancel = () => {
        onCancel();
        setRestaurant(initialState);  // reset state
    }

    const updateName = (newName: string) => setRestaurant({
        ...restaurant,
        name: newName,
    });
    const updateLocation = (address: string) => setRestaurant({
        ...restaurant,
        locations: [{ address }],
    });
    const updatePrice = (newPrice: Price) => setRestaurant({
        ...restaurant,
        price: newPrice,
    });
    const addNewCuisine = (cuisine: Cuisine) => setRestaurant({
        ...restaurant,
        cuisines: [...(restaurant.cuisines ?? []), cuisine],
    });
    const removeCuisine = (i: number) => setRestaurant({
        ...restaurant,
        cuisines: [
            ...(restaurant.cuisines ?? []).slice(0, i),
            ...(restaurant.cuisines ?? []).slice(i+1),
        ],
    });
    const updateNotes = (newNotes: string) => setRestaurant({
        ...restaurant,
        notes: newNotes.split("\n"),
    });

    const header = (props.editMode ? "Edit Restaurant" : "New Restaurant");
    const fullscreen = (props.editMode ? true : false);
    return (<CreationPopup header={header} fullscreen={fullscreen} onDone={doSubmit} onCancel={doCancel}>
        <input type="text"
            placeholder="name"
            value={restaurant.name ?? ""}
            onChange={(ev) => updateName(ev.target.value)} />

        <input type="text"
            placeholder="location"
            value={restaurant.locations?.[0]?.address ?? ""}
            onChange={(ev) => updateLocation(ev.target.value)} />

        <div>
            <h1>Cuisines</h1>
            <div className={styles["restaurant-cuisines__list"]}>
                {(restaurant.cuisines ?? []).map((cuisine, i) => (
                    <span key={cuisine}>{cuisine} <span onClick={() => removeCuisine(i)}>x</span></span>))}
            </div>
            <div>
                <select name="cuisine"
                    value={"default"}
                    onChange={(ev) => {
                        if (ev.target.value != "default")
                            addNewCuisine(ev.target.value as Cuisine);
                    }}>
                    <option value="default" disabled>+ Cuisine</option>
                    {CUISINES.filter((c) => (restaurant.cuisines?.find((v) => (v === c)) == undefined))
                        .map((c) =>
                            <option value={c} key={c}>{c}</option>)}
                </select>
            </div>
        </div>

        <div>
            <h1>
                Price
            </h1>
            <PriceSlider value={restaurant.price ?? 0} onChange={updatePrice} />
        </div>

        <textarea placeholder="notes"
            value={restaurant.notes?.join("\n") ?? ""}
            onChange={(ev) => updateNotes(ev.target.value)} />
    </CreationPopup>);
}
