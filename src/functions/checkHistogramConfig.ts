import { HistogramConfig } from '../types/HistogramConfig';

export function checkHistogramConfig(histogramConfig: HistogramConfig): boolean{
if (histogramConfig.lowerLimit >= histogramConfig.upperLimit) {
    return false;
}
if (histogramConfig.decimalPlaces < 0 || histogramConfig.decimalPlaces > 1) {
    return false;
}
if (histogramConfig.dataCount < 1) {
    return false;
}
if (histogramConfig.binCount < 1) {
    return false;
}
return true;
}
