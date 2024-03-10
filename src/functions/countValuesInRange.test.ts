import { countValuesInRange } from './countValuesInRange';

describe('countValuesInRange', () => {
    const testData1 = [1, 10, 11, 20, 21, 22, 30];

    test('Range（引数の配列の最小値未満, 引数の配列の最大値より大きい) -> 配列の個数', () => {
        expect(countValuesInRange(testData1, [0, 50])).toBe(7);
    });

    test('Range（引数の配列の最小値, 引数の配列の最大値) -> 配列の個数-1', () => {
        expect(countValuesInRange(testData1, [1, 30])).toBe(6);
    });

    test('Rangeの下は含まれる', () => {
        expect(countValuesInRange(testData1, [30, 50])).toBe(1);
    });

    test('Rangeの上は含まれない', () => {
        expect(countValuesInRange(testData1, [0, 1])).toBe(0);
    });

    test('Rangeの１つ目と２つ目の大小関係が逆の場合0', () => {
        expect(countValuesInRange(testData1, [30, 20])).toBe(0);
    });
});
