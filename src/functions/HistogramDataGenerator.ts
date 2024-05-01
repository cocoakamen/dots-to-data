
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
      let centerIndex = 0;
      if (this.config.binCount % 2 === 0) {
        centerIndex = this.config.binCount / 2 - 1;
      } else {
        centerIndex = Math.floor(this.config.binCount / 2);
      }

      // １段ずつデータを追加していく
      let addCount = 1;

      // データ数分くりかえす
      let count = 0;
      while( count < this.config.dataCount ){
        // 真ん中の前後にデータを追加していく
        // 一段の数
        const rowCount = Math.min(addCount * 2 - this.config.binCount % 2, this.config.binCount);
        const offSet = Math.min(addCount - 1 , centerIndex);
        for (let i = 0 ; i < rowCount; i++) {
          if (count >= this.config.dataCount) {
            break;
          }
          binDataCountList[centerIndex - offSet + i] += 1;
          count++;
        }
        // console.log(`centerIndex: ${centerIndex} 
        //               addCount: ${addCount} count: ${count} rowCount: ${rowCount} 
        //               offSet: ${offSet}  centerIndex - offSet : ${centerIndex - offSet }
        //               binDataCountList: ${binDataCountList} `);

        addCount++;

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

    // leftHigh型の場合
    if ( this.config.histogramType === "leftHigh" ) {
      // dataCount分の配列を確保する
      binDataCountList = new Array(this.config.binCount).fill(0);

      // データを追加し始めるインデックス
      const startIndex = Math.floor(this.config.binCount * 0.2);
      
      // １段ずつデータを追加していく
      let addCount = 1;

      // データ数分くりかえす
      let count = 0;
      while( count < this.config.dataCount ){
        // 真ん中の前後にデータを追加していく
        // 一段の数
        let rowCount = 0;
        if ( addCount <= startIndex) {
          rowCount = 2 * addCount -1;
        } else {
          rowCount = Math.min( addCount + 1, this.config.binCount );
        }
        const offSet = Math.min(addCount - 1 , startIndex);
        for (let i = 0 ; i < rowCount; i++) {
          if (count >= this.config.dataCount) {
            break;
          }
          binDataCountList[startIndex - offSet + i] += 1;
          count++;
        }
        // console.log(`histgramType: ${this.config.histogramType} startIndex: ${startIndex} 
        //               addCount: ${addCount} count: ${count} rowCount: ${rowCount} 
        //               offSet: ${offSet}  startIndex - offSet : ${startIndex - offSet }
        //               binDataCountList: ${binDataCountList} `);

        addCount++;

      }
    }

    // rightHigh型の場合
    if ( this.config.histogramType === "rightHigh" ) {
      // dataCount分の配列を確保する
      binDataCountList = new Array(this.config.binCount).fill(0);

      // データを追加し始めるインデックス
      const startIndex = Math.ceil(this.config.binCount * 0.8) - 1;
      
      // 1段ずつデータを追加していく
      let addCount = 1;

      // データ数分くりかえす
      let count = 0;
      while( count < this.config.dataCount ){
        // 一段の数
        let rowCount = 0;
        // console.log(`startIndex: ${startIndex} addCount: ${addCount} bincount: ${this.config.binCount}`);
        if ( startIndex + addCount  <= this.config.binCount ) {
          rowCount = addCount * 2 - 1;
        } else {
          rowCount = Math.min( this.config.binCount - startIndex + addCount -1, this.config.binCount );
        }
        const offSet = Math.min(addCount - 1 , startIndex) ;
        for (let i = 0 ; i < rowCount; i++) {
          if (count >= this.config.dataCount) {
            break;
          }
          binDataCountList[startIndex - offSet + i] += 1;
          count++;
        }
        // console.log(`startIndex: ${startIndex} histgramType: ${this.config.histogramType}
        //               addCount: ${addCount} count: ${count} rowCount: ${rowCount} 
        //               offSet: ${offSet}  startIndex - offSet : ${startIndex - offSet }
        //               binDataCountList: ${binDataCountList} `);

        addCount++;

      }
    }
    // console.log(`binDataCountList: ${binDataCountList}`);
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