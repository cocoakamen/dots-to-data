import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { HistogramDataGenerator } from '../functions/HistogramDataGenerator';

const HistogramDots: React.FC = () => {
  // canvasRef は、描画するための canvas エレメントへの参照
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React router から渡されたパラメータを取得
  const location = useLocation();
  const histogramConfig = location.state.histogramConfig;

  // generator
  const generator = new HistogramDataGenerator(histogramConfig);

  // ヒストグラムのデータ
  const [dataCountList, setDataCountList] = useState<number[]>([]);
  const [histogramData, setHistogramData] = useState<number[]>([]);

  // ヒストグラムの描画領域の設定値
  const CANVAS_BG_COLOR = '#EEFFFF';
  const CANVAS_LINE_COLOR = '#000000';

  type GraphAreaConfig = {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    xStep: number;
    yStep: number;
  }

  const [graphAreaConfig, setGraphAreaConfig] = useState< GraphAreaConfig>({
     xStart:0, yStart:0 , xEnd: 0, yEnd: 0, xStep: 1, yStep: 1 
  });
  const [xPositions, setXPositions] = useState<number[]>([]);
  const [yPositions, setYPositions] = useState<number[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number; bin: number }[]>([]);
  const [radius, setRadius] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // グラフの描画領域をクリアする
  const drawGraphArea = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const width = Math.min(680, window.innerWidth * 0.9);
    const height = Math.min(400, window.innerHeight * 0.9);
    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = CANVAS_BG_COLOR;
    context.fillRect(0, 0, width, height);
  };

  // グラフの軸を描画する
  const drawAxis = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const xStart = graphAreaConfig.xStart; 
    const xEnd = graphAreaConfig.xEnd;
    const yStart = graphAreaConfig.yStart;
    const yEnd = graphAreaConfig.yEnd;
    const xStep = graphAreaConfig.xStep;
    const yStep = graphAreaConfig.yStep;    

    context.strokeStyle = CANVAS_LINE_COLOR;
    context.beginPath();
    context.moveTo(xStart, yStart);
    context.lineTo(xStart, yEnd);
    context.lineTo(xEnd, yEnd);
    context.stroke();
    context.closePath();

    for (let i = 0; i < histogramConfig.binCount; i++) {
      context.beginPath();
      context.moveTo(xStart + xStep * i, yEnd);
      context.lineTo(xStart + xStep * i, yEnd + 10);
      context.stroke();
      context.closePath();
    }


    for (let i = 0; i < Math.max(...dataCountList); i++) {
      context.beginPath();
      context.moveTo(xStart, yEnd - yStep * i);
      context.lineTo(xStart - 10, yEnd - yStep * i);
      context.stroke();
      context.closePath();
    }

    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = CANVAS_LINE_COLOR;

    for (let i = 1; i < histogramConfig.binCount; i++) {
      context.fillText(
        (histogramConfig.lowerLimit + (histogramConfig.upperLimit - histogramConfig.lowerLimit) / histogramConfig.binCount * i).toFixed(histogramConfig.decimalPlaces),
        xStart + xStep * i,
        yEnd + 10
      );
    }

    for (let i = 1; i < Math.max(...dataCountList); i++) {
      context.fillText(
        i.toString(),
        xStart - 15,
        yEnd - yStep * i - 5
      );
    }
  };

  // 位置情報を元に、円を描画する
  const drawAllCircles = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const radius = Math.min( graphAreaConfig.xStep * 0.8 , graphAreaConfig.yStep * 0.8 ) / 2;
    setRadius(radius);
    console.log(`drawAllCircles: xStep ${graphAreaConfig.xStep}: yStep ${graphAreaConfig.yStep} : r ${radius}`);
    positions.forEach(position => {
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
      context.fillStyle = CANVAS_LINE_COLOR;
      context.fill();
      context.closePath();
    });
  };

  // x座標をもとにdataCountListのindexを返す
  const getBinIndex = (x: number) => {
    const xStart = graphAreaConfig.xStart; 
    const xStep = graphAreaConfig.xStep;
    return Math.floor((x - xStart) / xStep);
  };

  // マウスダウンイベントの処理
  const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
    console.log(`handleMouseDown ${JSON.stringify(event)}: x ${x}, y ${y}, radius ${radius}, length ${positions.length}`);
    
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const isInsideCircle = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2) < radius;
      if (isInsideCircle) {
        setIsDragging(true);
        setDraggedIndex(i);
        console.log(`handleMouseDown: ${i}`);
        break;
      }
    }
  };

  // マウスアップイベントの処理
  const handleMouseUp = () => {
    console.log(`handleMouseUp : isDragging: ${isDragging}`);

    if(draggedIndex === null) return;
    if (!isDragging) return;
    
    // Positons配列のbinの値からdataCountListを更新する
    const newDataCountList = [];
    for (let i = 0; i < histogramConfig.binCount; i++) {
      newDataCountList.push(positions.filter(position => position.bin === i).length);
    }
    setDataCountList(newDataCountList);
    console.log(`handleMouseUp: ${JSON.stringify(newDataCountList)}`);
    
    // ドラッグ終了
    setIsDragging(false);
    setDraggedIndex(null);
  };

  // マウスムーブイベントの処理
  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    console.log(`handleMouseMove : isDragging: ${isDragging}`);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
      const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
      setPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[draggedIndex!] = { x, y, bin: getBinIndex(x)};
        return newPositions;
      });
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.strokeStyle = 'gray';
      context.stroke();
      context.closePath();
    }
  };

  // positionsが変更されたら、円を再描画する
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    drawGraphArea();
    drawAxis();
    drawAllCircles();

    // リスナー登録
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchmove', handleMouseMove);
    canvas.addEventListener('touchend', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    }
  }, [positions]);

  // ヒストグラムデータ生成
  useEffect(() => {
    setDataCountList(generator.binDataCountList);
    setHistogramData(generator.genarateHistogramData);
    console.log('useEffect histogramData: ');
  
  }, []);

  // グラフの描画領域の設定値を設定する
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const width = Math.min(680, window.innerWidth * 0.9);
    const height = Math.min(400, window.innerHeight * 0.9);
    canvas.width = width;
    canvas.height = height;

    const xStart = Math.ceil(Math.min(width * 0.05, 100));
    const xEnd = Math.ceil(Math.min(width * 0.95, 600));
    const yStart = Math.ceil(Math.min(height * 0.05, 100));
    const yEnd = Math.ceil(Math.min(height * 0.95, 350));
    const xStep = Math.ceil((xEnd - xStart) / histogramConfig.binCount);
    const yStep = (yEnd - yStart) / (Math.max(...dataCountList) + Math.ceil(Math.max(...dataCountList) / 5));
    const xCenters = [];
    const yCenters = [];

  
    for (let i = 0; i < histogramConfig.binCount; i++) {
      xCenters.push(xStart + xStep * i + xStep / 2);
    }
    setXPositions(xCenters);

    for (let i = 0; i < Math.max(...dataCountList); i++) {
      yCenters.push(yEnd - yStep * i - yStep / 2);
    }
    setYPositions(yCenters);

    setGraphAreaConfig({ 
      xStart: xStart, 
      yStart: yStart, 
      xEnd: xEnd, 
      yEnd: yEnd, 
      xStep: xStep, 
      yStep: yStep 
    });
    console.log(`useEffect canvas: ${JSON.stringify(graphAreaConfig)}`);
    
  }, [dataCountList, histogramConfig]);

  // histogramDataを生成する
  useEffect(() => {
    generator.binDataCountList = dataCountList;
    setHistogramData(generator.genarateHistogramData);
    console.log('useEffect histogramData: ', generator.genarateHistogramData);
  
  }, [　dataCountList]);

  // ドラッグ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);

    }
  }, [isDragging, draggedIndex]);

  //  xPositons, yPositonsが変更されたら、Positionsを更新する
  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < dataCountList.length; i++) {
      for (let j = 0; j < dataCountList[i]; j++) {
        newPositions.push({ x: xPositions[i], y: yPositions[j], bin: i});
      }
    }
    setPositions(newPositions);
    console.log(`useEffect: ${JSON.stringify(newPositions)}`);
  
  }, [xPositions, yPositions]);

  // GraphAreaConfig が変更されたら、canvasを再描画する
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    drawGraphArea();
    drawAxis();
  }, [graphAreaConfig]);

  // positionsが変更されたら、円を再描画する
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    drawAllCircles();
  }, [positions]);

  return (
    <Box>
      <div>{JSON.stringify(histogramConfig)}</div>
      <div>{JSON.stringify(histogramData)}</div>
      <div>{JSON.stringify(dataCountList)}</div>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <canvas ref={canvasRef} width="100%" />
      </Box>
    </Box>
  );
};

export default HistogramDots;
