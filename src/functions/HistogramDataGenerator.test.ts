import { HistogramDataGenerator } from './HistogramDataGenerator';
// import { countValuesInRange } from './countValuesInRange';

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


    test('should generate bin data count list : type=flat 割り切れる時', () => {
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

    test('should generate bin data count list: type=flat 割り切れない時', () => {
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

    test('should generate bin data count list : type=fujisan binCountが奇数', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 0,
            dataCount: 20,
            binCount: 11,
            histogramType: 'fujisan'
        };
    
        const generator = new HistogramDataGenerator(histogramConfig);
        const binDataCountList = generator.binDataCountList;
    
        const expectedBinDataCountList = [0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0];
        expect(binDataCountList).toEqual(expectedBinDataCountList);
    });

    test('should generate bin data count list : type=fujisan binCountが奇数', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 0,
            dataCount: 25,
            binCount: 11,
            histogramType: 'fujisan'
        };
    
        const generator = new HistogramDataGenerator(histogramConfig);
        const binDataCountList = generator.binDataCountList;
    
        const expectedBinDataCountList = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
        expect(binDataCountList).toEqual(expectedBinDataCountList);
    });

    test('should generate bin data count list : type=fujisan binCountが偶数', () => {
        const histogramConfig = {
            lowerLimit: 0,
            upperLimit: 100,
            decimalPlaces: 0,
            dataCount: 12,
            binCount: 10,
            histogramType: 'fujisan'
        };
    
        const generator = new HistogramDataGenerator(histogramConfig);
        const binDataCountList = generator.binDataCountList;
    
        const expectedBinDataCountList = [0, 0, 1, 2, 3, 3, 2, 1, 0, 0];
        expect(binDataCountList).toEqual(expectedBinDataCountList);
    });
});

