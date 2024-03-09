export function countValuesInRange(values: number[], range: [number, number]): number {
    let count = 0;
    // rangeの大小関係が逆の場合は0を返す
    if (range[0] > range[1]) {
        return 0;
    }

    for (let value of values) {
        if (value >= range[0] && value < range[1]) {
            count++;
        }
    }
    return count;
}