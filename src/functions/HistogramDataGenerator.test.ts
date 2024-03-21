import { HistogramDataGenerator } from './HistogramDataGenerator';
import { countValuesInRange } from './countValuesInRange';

describe('HistogramDataGenerator', () => {

    test('should calculate the correct bin width', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 2,
            dataCount: 10,
            binCount: 5,
            histogramType: 'flat'
        };

        const generator = new HistogramDataGenerator(histogramConfig);
        const binWidth = generator.binWidth;

        expect(binWidth).toBe(20);
    });

    test('should calculate the correct bin width', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 10,
            decimalPlaces: 2,
            dataCount: 3,
            binCount: 5,
            histogramType: 'flat'
        };

        const generator = new HistogramDataGenerator(histogramConfig);
        const binWidth = generator.binWidth;

        expect(binWidth).toBe(2);
    });

    test('should generate flat histogram data 割り切れる時', () => {

        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100, 
            decimalPlaces: 0,
            dataCount: 20, 
            binCount: 10,
            histogramType: 'flat'
        };

        const generator = new HistogramDataGenerator(
            histogramConfig
        );
        const histogramData = generator.genarateHistogramData;

        // データ数
        expect(histogramData.length).toBe(histogramConfig.dataCount);

        // dataRangeのminからbinWidthの間に入っているデータの数を数える
        let minValue = histogramConfig.lowerLimit;
        while (minValue < histogramConfig.upperLimit) {
            let count = countValuesInRange(histogramData, [minValue, minValue + generator.binWidth]);
            expect(count).toBe(2);
            minValue += generator.binWidth;
        }
    });

    test('should generate flat histogram data 割り切れない時', () => {

        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100, 
            decimalPlaces: 0,
            dataCount: 20, 
            binCount: 8,
            histogramType: 'flat'
        };

        const exppectedDataCount = [3, 3, 3, 3, 2, 2, 2, 2];
        let dataCountList = [];

        const generator = new HistogramDataGenerator(
            histogramConfig
        );
        const histogramData = generator.genarateHistogramData;

        // データ数
        expect(histogramData.length).toBe(histogramConfig.dataCount);

        // dataRangeのminからbinWidthの間に入っているデータの数を数える
        let minValue = histogramConfig.lowerLimit;
        while (minValue < histogramConfig.upperLimit) {
            let count = countValuesInRange(histogramData, [minValue, minValue + generator.binWidth]);
            dataCountList.push(count);
            minValue += generator.binWidth;
        }
        expect(dataCountList).toEqual(exppectedDataCount);
    });

    test('should generate bin data count list 割り切れる時', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 0,
            dataCount: 20,
            binCount: 10,
            histogramType: 'flat'
        };
    
        const generator = new HistogramDataGenerator(histogramConfig);
        const binDataCountList = generator.binDataCountList;
    
        const expectedBinDataCountList = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        expect(binDataCountList).toEqual(expectedBinDataCountList);
    });

    test('should generate bin data count list 割り切れない時', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 0,
            dataCount: 20,
            binCount: 8,
            histogramType: 'flat'
        };
    
        const generator = new HistogramDataGenerator(histogramConfig);
        const binDataCountList = generator.binDataCountList;
    
        const expectedBinDataCountList = [3, 3, 3, 3, 2, 2, 2, 2];
        expect(binDataCountList).toEqual(expectedBinDataCountList);
    });

});

