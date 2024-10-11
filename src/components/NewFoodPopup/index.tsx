import type {UUID, User, Category, Food} from "model/schema";

import {Fragment, useState} from "react";
import {uuid, CATEGORIES} from "model/schema";
import {CreationPopup} from "components/CreationPopup";

import styles from "./index.module.scss";


interface RatingSliderProps {
    value: number;
    onChange: (newVal: number) => void;
}
function RatingSlider({ value, onChange }: RatingSliderProps) {
    return (<div className={styles["food-rating__slider"]}>
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

type NewFoodPopupProps = {
    restaurantId: UUID;
    users: User[];
    onSubmit: (food: Food) => void;
    onCancel: () => void;
} & ({
    editMode?: false;
} | {
    editMode: true;
    initialFood: Food;
})
export function NewFoodPopup({ restaurantId, users, onCancel, onSubmit, ...props }: NewFoodPopupProps) {
    const initialState = props.editMode ? props.initialFood : {};
    const [food, setFood] = useState<Partial<Omit<Food, "restaurantId" | "id">>>(initialState);

    const usersWithoutRating = users.filter((u) => (food.ratings?.[u.id] === undefined));

    const doSubmit = () => {
        if (!food.name)
            return;

        onSubmit({
            restaurantId,
            id: uuid(),

            ...food,
            name: food.name,
            alternameNames: food.alternameNames?.map(n => n.trim()),
            isFavorite: food.isFavorite ?? false,
        });

        setFood(initialState);  // reset state
    }
    const doCancel = () => {
        onCancel();
        setFood(initialState);  // reset state
    }

    const updateName = (newName: string) => setFood({
        ...food,
        name: newName,
    });
    const updateAlertnameNames = (alternateNames: string) => setFood({
        ...food,
        alternameNames: alternateNames.split(",")
    });
    const updateCategory = (newCategory: string) => setFood({
        ...food,
        category: newCategory as Category,
    });
    const updateRating = (userId: UUID, rating: number) => setFood({
        ...food,
        ratings: {
            ...food.ratings,
            [userId]: rating,
        },
    });
    const addNewRating = (userId: UUID) => setFood({
        ...food,
        ratings: {
            ...(food.ratings ?? {}),
            [userId]: 0,
        },
    });
    const updateSpecialInstruction = (instruction: string, i: number) => setFood({
        ...food,
        specialInstructions: [
            ...(food.specialInstructions ?? []).slice(0, i),
            instruction,
            ...(food.specialInstructions ?? []).slice(i+1),
        ],
    });
    const addNewSpecialInstruction = () => setFood({
        ...food,
        specialInstructions: [...(food.specialInstructions ?? []), ""],
    });
    const updateNotes = (newNotes: string) => setFood({
        ...food,
        notes: newNotes.split("\n"),
    });

    const header = (props.editMode ? "Edit Food" : "New Food");
    const fullscreen = (props.editMode ? true : false);
    return (<CreationPopup header={header} fullscreen={fullscreen} onDone={doSubmit} onCancel={doCancel}>
        <input type="text"
            placeholder="name"
            value={food.name ?? ""}
            onChange={(ev) => updateName(ev.target.value)} />

        <input type="text"
            placeholder="alternate names (comma separated)"
            value={food.alternameNames?.join(",") ?? ""}
            onChange={(ev) => updateAlertnameNames(ev.target.value)} />

        <select name="category"
            value={food.category ?? ""}
            onChange={(ev) => updateCategory(ev.target.value)}>
            <option value="" disabled>Category</option>
            {CATEGORIES.map((c) => (
               <option key={c} value={c}>{c}</option>))}
        </select>

        <div>
            <h1>Ratings</h1>
            <div className={styles["food-rating"]}>
                {Object.entries(food.ratings ?? {}).map(([userId, rating]) => (<Fragment key={userId}>
                    <h2>{users.find((u) => (u.id === userId))!.name}</h2>
                    <RatingSlider value={rating}
                        onChange={(rating) => updateRating(userId, rating)} />
                </Fragment>))}
                <select value={"default"}
                    onChange={(ev) => {
                        if (ev.target.value != "default")
                            addNewRating(ev.target.value as UUID);
                    }}>
                    <option value="default" disabled>+ Rating</option>
                    {usersWithoutRating.map((u) =>
                        <option value={u.id} key={u.id}>{u.name}</option>)}
                </select>
            </div>
        </div>

        <div>
            <h1>Special Instructions</h1>
            <div className={styles["food-special-instructions"]}>
                {(food.specialInstructions ?? [""]).map((instruction, i) => (<div key={i}>
                    <input type="text"
                        placeholder="instruction 1"
                        value={instruction}
                        onChange={(ev) => updateSpecialInstruction(ev.target.value, i)} />
                    <span onClick={addNewSpecialInstruction}>+</span>
                </div>))}
            </div>
        </div>

        <textarea placeholder="notes"
            value={food.notes?.join("\n") ?? ""}
            onChange={(ev) => updateNotes(ev.target.value)} />
    </CreationPopup>);
}
