import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const HistogramDots: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [positions, setPositions] = useState<{ x: number, y: number }[]>([
        { x: 50, y: 50 },{ x: 100, y: 100 },{ x: 150, y: 150 }
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const location = useLocation();
    const histogramConfig = location.state.histogramConfig;
    const CANVAS_BG_COLOR = '#EEFFFF';
    const CANVAS_LINE_COLOR = '#000000';

    useEffect(() => {
      console.log(JSON.stringify(positions));
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!context || !canvas) return;

      const radius = 20;

      const initCanvas = () => {
        canvas.width = Math.min( 680, window.innerWidth * 0.9) ;
        canvas.height = Math.min( 400, window.innerHeight * 0.9);

        // canvasをクリア
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 背景の色を設定
        context.fillStyle = CANVAS_BG_COLOR;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // 軸を描画
        drawAxis();
      }

      // グラフの軸を書く
      const drawAxis = () => {
        const w = canvas.width;
        const h = canvas.height;
        const xStart = Math.min(w * 0.05, 100);
        const xEnd = Math.min(w * 0.95, 600);
        const yStart = Math.min(h * 0.05, 100);
        const yEnd = Math.min(h * 0.95, 350);
        context.strokeStyle = CANVAS_LINE_COLOR;
        context.beginPath();
        context.moveTo( xStart, yStart);
        context.lineTo(xStart, yEnd);
        context.lineTo(xEnd, yEnd);
        context.stroke();
        context.closePath();

        // 目盛りを描画
        const xStep = (xEnd - xStart) / histogramConfig.binCount;
        const yStep = (yEnd - yStart) / 10;
        for (let i = 1; i < histogramConfig.binCount; i++) {
          context.beginPath();
          context.moveTo(xStart + xStep * i, yEnd);
          context.lineTo(xStart + xStep * i, yEnd + 10);
          context.stroke();
          context.closePath();
          context.beginPath();
          context.moveTo(xStart, yEnd - yStep * i);
          context.lineTo(xStart - 10, yEnd - yStep * i);
          context.stroke();
          context.closePath();
        }

        // 目盛りの値を描画
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
          context.fillText(
            (histogramConfig.dataCount / 10 * i).toFixed(0),
            xStart - 10,
            yEnd - yStep * i
          );
        }
      }

      // 1つの円を描画する関数
      const drawCircle = (x: number, y: number, color: string) => {
          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fillStyle = color;
          context.fill();
          context.closePath();
      };

      // 1つの円を描画する関数
      const drawDraggedCircle = (x: number, y: number, color: string) => {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
      };
      
      // すべての円を描画する関数
      const drawAllCircles = () => {
          // すべての円を描画
          positions.forEach(position => {
              drawCircle(position.x, position.y, CANVAS_LINE_COLOR);
          });
      };

      // canvasのリサイズ
      const resizeCanvas = () => {
        canvas.width = Math.min( 680, window.innerWidth * 0.9) ;
        canvas.height = Math.min( 400, window.innerHeight * 0.9);
        // すべての円を再描画
        initCanvas();
        drawAllCircles();
      };


      resizeCanvas();

      // 初期表示の円を描画
      initCanvas();
      drawAllCircles();

      const handleMouseDown = (event: MouseEvent　| TouchEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
          const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

          // すべての円について確認
          for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const isInsideCircle = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2) < radius;
            if (isInsideCircle) {
              setIsDragging(true);
              // ドラッグ中の円のインデックスを記録
              setDraggedIndex(i);
              break;
            }
          }
      };

      const handleMouseUp = () => {
          setIsDragging(false);
      };

      const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (isDragging) {
          const rect = canvas.getBoundingClientRect();
          const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
          const y = 'touches' in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
          // ドラッグ中の円の位置を更新
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

    }, [isDragging, positions]);

    return (
        <Container>
          <div>
            {JSON.stringify(histogramConfig)}
          </div>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <canvas ref={canvasRef} width="100%" />; 
          </Box>
        </Container>
    )
};

export default HistogramDots;