import React, { useEffect, useRef, useState } from 'react';

const HistogramDots: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!context || !canvas) return;

        const radius = 50;

        const drawCircle = (x: number, y: number, color: string) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        };

        // 初期表示の円を描画
        drawCircle(position.x, position.y, 'green');

        const handleMouseDown = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const isInsideCircle = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2) < radius;
            if (isInsideCircle) setIsDragging(true);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                setPosition({ x, y });
                drawCircle(x, y, 'green');
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging]);

    return <canvas ref={canvasRef} />;
};

export default HistogramDots;