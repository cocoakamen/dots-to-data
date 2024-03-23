
import { HistogramConfig } from "../types/HistogramConfig";

export class HistogramDataGenerator {
  private config: HistogramConfig;
  private histogramData : number[] = [];
  private dataCountList : number[] = [];

  constructor(config: HistogramConfig) {
    this.config = config;
  }

  // ヒストグラムデータを返す
  get genarateHistogramData(): number[] {
    this.histogramData = [];
    // binCountの数だけ、dataPerBinの数をhistogramDataに追加する
    for (let i = 0; i < this.config.binCount; i++) {
      // dataRangeの中で乱数を発生して、histogramDataに追加する
      const min = this.config.lowerLimit + this.binWidth * i;
      const max = min + this.binWidth;
      const dataPerBin = this.dataCountList[i];
      for (let j = 0; j < dataPerBin; j++) {
        const random = Math.floor(
                        (Math.random() * (max - min) + min) 
                          * Math.pow(10, this.config.decimalPlaces)) 
                          / Math.pow(10, this.config.decimalPlaces);
        this.histogramData.push(random);
      }
    }

    return this.histogramData;
  }
  
  // 各階層の幅を返す
  get binWidth(): number {
    // 小数点以下桁数をdecimalPlacesにする
    return Number(((this.config.upperLimit - this.config.lowerLimit) / this.config.binCount).toFixed(this.config.decimalPlaces));
  }

  // 階層ごとのデータ数をセットする
  set binDataCountList(binDataCountList: number[]) {
    this.dataCountList = binDataCountList;
  }

  // 指定したTypeの階層ごとのデータ数をリストで返す
  get binDataCountList(): number[] {
    // 各binのデータ数
    let binDataCountList: number[] = [];
    
    // フジサン型の場合
    if ( this.config.histogramType === "fujisan" ) {
      // dataCount分の配列を確保する
      binDataCountList = new Array(this.config.binCount).fill(0);

      // binCountが奇数の場合
      // 真ん中のインデックスを取得する
      const centerIndex = Math.floor(this.config.binCount / 2);
      // 真ん中から順番に足していくインデックスの順番配列を作る
      let addCount = 1;

      // データ数分くりかえす
      let count = 0;
      while( count < this.config.dataCount ){
        // 真ん中の前後にデータを追加していく
        // 一段の数
        const rowCount = Math.min(addCount * 2 - this.config.binCount % 2, this.config.binCount);
        const offSet = Math.min(addCount - 1, centerIndex);
        for (let i = 0 ; i < rowCount; i++) {
          if (count < this.config.dataCount) {
            binDataCountList[centerIndex - 1 - offSet + i] += 1;
            count++;
          }
        }
        addCount++;
        console.log(`centerIndex: ${centerIndex} addCount: ${addCount} count: ${count} rowCount: ${rowCount} binDataCountList: ${binDataCountList}`);

      }
    }

    if ( this.config.histogramType === "flat" ) {
      // dataCountから、各binに入るデータの数を計算する(小数点以下は切り捨てる)
      const dataPerBin = Math.floor(this.config.dataCount / this.config.binCount);
      // dataCountから、各binに入るデータの余りを計算する
      const remainder = this.config.dataCount % this.config.binCount;
      // binCountの数だけ、dataPerBinの数をbinDataCountListに追加する
      for (let i = 0; i < this.config.binCount; i++) {
        binDataCountList.push(dataPerBin);
      }
      // 余りをbinDataCountListに追加する
      for (let i = 0; i < remainder; i++) {
        binDataCountList[i] += 1;
      }
    }
    console.log(`binDataCountList: ${binDataCountList}`);
    this.dataCountList = binDataCountList;
    return this.dataCountList;
  }

  countValuesInRange(values: number[], range: [number, number]) {
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

}