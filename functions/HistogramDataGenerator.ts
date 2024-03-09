export class HistogramDataGenerator {
  private dataRange: [number, number];
  private binWidth: number;
  private dataCount: number;
  private decimalPlaces: number;
  private histogramType: string;

  constructor(
      dataRange: [number, number],
      binWidth: number,
      dataCount: number,
      decimalPlaces: number,
      histogramType: string,
  ) {
      if (dataRange[0] >= dataRange[1]) {
          throw new Error("Invalid data range");
      }

      if (binWidth <= 0) {
          throw new Error("Invalid bin width");
      }

      if (dataCount <= 0) {
          throw new Error("Invalid data count");
      }

      if (histogramType !== "flat" && histogramType !== "discrete") {
          throw new Error("Invalid histogram type");
      }

      if (decimalPlaces < 0) {
          throw new Error("Invalid decimal places");
      }

      this.dataRange = dataRange;
      this.binWidth = binWidth;
      this.dataCount = dataCount;
      this.decimalPlaces = decimalPlaces;
      this.histogramType = histogramType;
  }

  generateHistogramData(): number[] {
    let histogramData: number[] = [];
    // ここにヒストグラムデータを生成するロジックを書く
    if (this.histogramType === "flat") {
      histogramData = this.generateFlatHistogramData();
      console.log(histogramData);
    } 

    return histogramData;    
  }

  // ここから下はprivateメソッド

  private generateFlatHistogramData(): number[] {
    let flatHistogramData: number[] = [];
    // dataRange, binWidthから、binの数を計算する
    const binCount = Math.ceil((this.dataRange[1] - this.dataRange[0]) / this.binWidth);
    // dataCountから、各binに入るデータの数を計算する(小数点以下は切り捨てる)
    const dataPerBin = Math.floor(this.dataCount / binCount);
    // binCountの数だけ、dataPerBinの数をflatHistogramDataに追加する
    for (let i = 0; i < binCount; i++) {
      // dataRangeの中で乱数を生成してflatHistogramDataに追加する
      const min = this.dataRange[0] + i * this.binWidth;
      const max = min + this.binWidth;
      for (let j = 0; j < dataPerBin; j++) {
          const random = Math.floor(
                          (Math.random() * (max - min) + min) 
                              * Math.pow(10, this.decimalPlaces)) 
                            / Math.pow(10, this.decimalPlaces
                          );
          flatHistogramData.push(random);
      }
    }
    return flatHistogramData;
  }
}