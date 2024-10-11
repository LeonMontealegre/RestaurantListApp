
interface RatingProps {
    rating?: number;
    otherInfo?: string;
}
export function Rating({ rating, otherInfo }: RatingProps) {
    if (rating === undefined && otherInfo === undefined)
        return null;

    const strRating = rating !== undefined
        ? ["Bad", "Eh", "Alright", "Pretty Good", "GOOD"][rating*4]
        : undefined;
    const color = rating !== undefined
        ? ["#ff4545", "#ffa534", "#eebb34", "#97ee29", "#57cc29"][rating*4]
        : "#99999933";

    return (
        <span style={{
            backgroundColor: color,
            fontWeight: "bold",
            padding: "2px",
            marginTop: "2px",
        }}>
            {[otherInfo, strRating]
                .filter((x) => (x !== undefined && x !== ""))
                .join(" / ")}
        </span>
    );
}
