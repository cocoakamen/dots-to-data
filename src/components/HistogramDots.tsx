import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { HistogramDataGenerator } from '../functions/HistogramDataGenerator';

const HistogramDots: React.FC = () => {
  const location = useLocation();
  const histogramConfig = location.state.histogramConfig;
  const generator = new HistogramDataGenerator(histogramConfig);
  const CANVAS_BG_COLOR = '#EEFFFF';
  const CANVAS_LINE_COLOR = '#000000';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([
    { x: 50, y: 50 },
    { x: 100, y: 100 },
    { x: 150, y: 150 },
  ]);
  const [radius, setRadius] = useState(20);
  const [xPositions, setXPositions] = useState<number[]>([50, 100, 150]);
  const [yPositions, setYPositions] = useState<number[]>([50, 100, 150]);
  
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
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dataCountList, setDataCountList] = useState<number[]>(generator.binDataCountList);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // ヒストグラムの軸を描画する
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

  const drawGraphArea = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const width = canvasSize.width;
    const height = canvasSize.height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = CANVAS_BG_COLOR;
    context.fillRect(0, 0, width, height);
  };

  const drawAllCircles = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    positions.forEach(position => {
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
      context.fillStyle = CANVAS_LINE_COLOR;
      context.fill();
      context.closePath();
    });
  };

  // canvas再描画
  const updateCanvas = () => {
    drawGraphArea();
    drawAxis();
    drawAllCircles();
  };

  // Canvasサイズがセットされたら、グラフの描画領域を設定する
  useEffect(() => {
    console.log(`useEffect canvas: ${JSON.stringify(canvasSize)}`);

    const width = canvasSize.width;
    const height = canvasSize.height;
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
  }, [canvasSize]);

  // graphAreaConfigがセットされたら、GraphAreaを描画する
  useEffect(() => {
    console.log(`useEffect graphAreaConfig: ${JSON.stringify(graphAreaConfig)}`);
    updateCanvas();
  }, [graphAreaConfig, positions]  );

  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < dataCountList.length; i++) {
      for (let j = 0; j < dataCountList[i]; j++) {
        newPositions.push({ x: xPositions[i], y: yPositions[j] });
      }
    }
    setPositions(newPositions);
    console.log(`useEffect: ${JSON.stringify(newPositions)}`);
  
    }, [xPositions, yPositions]);

  useEffect(() => {
    console.log(`useEffect postitons: ${JSON.stringify(graphAreaConfig)}`);
  }, [positions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const radius = 20;

    const drawDraggedCircle = (x: number, y: number, color: string) => {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
    };



    const resizeCanvas = () => {
      const width = Math.min(680, window.innerWidth * 0.9);
      const height = Math.min(400, window.innerHeight * 0.9);
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ 
        width: width, 
        height: height 
      });
      drawGraphArea();
      drawAllCircles();
      console.log(`resizeCanvas: ${JSON.stringify(canvasSize)}`);
    };

    resizeCanvas();
    drawGraphArea();
    drawAxis();
    drawAllCircles();

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      console.log(`handleMouseDown: ${JSON.stringify(event)}`);
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
      const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        const isInsideCircle = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2) < radius;
        if (isInsideCircle) {
          setIsDragging(true);
          setDraggedIndex(i);
          break;
        }
      }
    };

    const handleMouseUp = () => {
      console.log('handleMouseUp');
      setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      console.log(`handleMouseMove: ${JSON.stringify(event)}`);
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
        const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
        setPositions(prevPositions => {
          const newPositions = [...prevPositions];
          newPositions[draggedIndex!] = { x, y };
          return newPositions;
        });
        drawDraggedCircle(x, y, 'gray');
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchend', handleMouseUp);
    canvas.addEventListener('touchmove', handleMouseMove);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);

      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchend', handleMouseUp);
      canvas.removeEventListener('touchmove', handleMouseMove);

      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDragging]);

  return (
    <Container>
      <div>{JSON.stringify(histogramConfig)}</div>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <canvas ref={canvasRef} width="100%" />
      </Box>
    </Container>
  );
};

export default HistogramDots;
