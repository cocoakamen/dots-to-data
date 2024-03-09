import { HistogramDataGenerator } from './HistogramDataGenerator';
import { countValuesInRange } from './countValuesInRange';

describe('HistogramDataGenerator', () => {
    test('should throw error for invalid data range', () => {
        expect(() => new HistogramDataGenerator([5, 4], 1, 10, 0, 'flat')).toThrow('Invalid data range');
    });

    test('should throw error for invalid bin width', () => {
        expect(() => new HistogramDataGenerator([1, 5], 0, 10, 0, 'flat')).toThrow('Invalid bin width');
    });

    test('should generate flat histogram data', () => {
        const dataRange: [number, number] = [0, 100];
        const binWidth = 10;
        const dataCount = 20;
        const decimalPlaces = 0;
        const histogramType = 'flat';
        const generator = new HistogramDataGenerator(dataRange, binWidth, dataCount, decimalPlaces, histogramType);
        const histogramData = generator.generateHistogramData();

        // dataRangeのminからbinWidthの間に入っているデータの数を数える
        let minValue = 0;
        while (minValue < dataRange[1]) {
            let count = countValuesInRange(histogramData, [minValue, minValue + binWidth]);
            expect(count).toBe(2);
        }
    });
    // Add more test cases here
});