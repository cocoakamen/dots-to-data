
import { HistogramConfig } from "../types/HistogramConfig";

export class HistogramDataGenerator {
  private config: HistogramConfig;

  constructor(config: HistogramConfig) {
    this.config = config;
  }

  // ヒストグラムデータを生成する
  generateHistogramData(): number[] {
    let histogramData: number[] = [];
    // ここにヒストグラムデータを生成するロジックを書く
    if (this.config.histogramType === "flat") {
      histogramData = this.generateFlatHistogramData();
      console.log(`generateHistogramData: ${histogramData}`);
    } 

    return histogramData;    
  }

  // 各階層の幅を返す
  get binWidth(): number {
    // 小数点以下桁数をdecimalPlacesにする
    return Number(((this.config.upperLimit - this.config.lowerLimit) / this.config.binCount).toFixed(this.config.decimalPlaces));
  }

  // 生成したリストから各階層のデータ数のリストを返す
  get binDataCountList(): number[] {
    // ヒストグラムのデータを生成する
    const histogramData = this.generateHistogramData();
    // 各binのデータ数を数える
    let binDataCountList: number[] = [];
    let minValue = this.config.lowerLimit;
    while (minValue < this.config.upperLimit) {
        let count = this.countValuesInRange(histogramData, [minValue, minValue + this.binWidth]);
        binDataCountList.push(count);
        minValue += this.binWidth;
    }
    return binDataCountList;
  }

  countValuesInRange(values: number[], range: [number, number]): number {
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

  // ここから下はprivateメソッド


  // ヒストグラムデータを生成する type='flat'
  private generateFlatHistogramData(): number[] {
    let flatHistogramData: number[] = [];
    // dataCountから、各binに入るデータの数を計算する(小数点以下は切り捨てる)
    const dataPerBin = Math.floor(this.config.dataCount / this.config.binCount);
    // dataCountから、各binに入るデータの余りを計算する
    const remainder = this.config.dataCount % this.config.binCount;

    // binCountの数だけ、dataPerBinの数をflatHistogramDataに追加する
    for (let i = 0; i < this.config.binCount; i++) {
      // dataRangeの中で乱数を生成してflatHistogramDataに追加する
      const min = this.config.lowerLimit + i * this.binWidth;
      const max = min + this.binWidth;
      for (let j = 0; j < dataPerBin; j++) {
          const random = Math.floor(
                          (Math.random() * (max - min) + min) 
                              * Math.pow(10, this.config.decimalPlaces)) 
                            / Math.pow(10, this.config.decimalPlaces
                          );
          flatHistogramData.push(random);
      }
    }

    // 余りをflatHistogramDataに追加する
    for (let i = 0; i < remainder; i++) {
      const min = this.config.lowerLimit + i * this.binWidth;
      const max = min + this.binWidth;
      const random = Math.floor(
                      (Math.random() * (max - min) + min) 
                          * Math.pow(10, this.config.decimalPlaces)) 
                        / Math.pow(10, this.config.decimalPlaces
                      );
      flatHistogramData.push(random);
    }
    return flatHistogramData;
  }
}