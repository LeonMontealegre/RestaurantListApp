
export function Average(arr: number[]): number {
    if (arr.length === 0)
        return NaN;
    return arr.reduce((prev, cur) => (prev + cur), 0) / arr.length;
}
