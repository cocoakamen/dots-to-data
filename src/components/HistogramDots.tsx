import React, { useEffect, useRef, useState } from 'react';

const HistogramDots: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [positions, setPositions] = useState<{ x: number, y: number }[]>([
        { x: 50, y: 50 },{ x: 100, y: 100 },{ x: 150, y: 150 }
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!context || !canvas) return;
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!context || !canvas) return;

        const radius = 20;

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
            context.clearRect(0, 0, canvas.width, canvas.height);
            positions.forEach(position => {
                drawCircle(position.x, position.y, 'black');
            });
        };

        // 初期表示の円を描画
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
            console.log('draggedIndex', draggedIndex, x, y);
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

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);

            canvas.removeEventListener('touchstart', handleMouseDown);
            canvas.removeEventListener('touchend', handleMouseUp);
            canvas.removeEventListener('touchmove', handleMouseMove);
        };
    }, [isDragging]);

    return <canvas ref={canvasRef} width={800} height={600}/>;
};

export default HistogramDots;