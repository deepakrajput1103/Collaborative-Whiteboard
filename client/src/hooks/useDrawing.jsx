import { useState, useCallback, useEffect } from 'react';

const useDrawing = (canvasRef, socket, roomId) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  const getCanvasCoordinates = useCallback((e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const drawLine = useCallback((ctx, start, end, color, width) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasCoordinates(e);
    setPrevPos(pos);

    if (socket) {
      socket.emit('draw-start', {
        roomId,
        start: pos,
        color,
        lineWidth,
      });
    }
  }, [getCanvasCoordinates, socket, roomId, color, lineWidth]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPos = getCanvasCoordinates(e);

    drawLine(ctx, prevPos, currentPos, color, lineWidth);

    if (socket) {
      socket.emit('draw-move', {
        roomId,
        start: prevPos,
        end: currentPos,
        color,
        lineWidth,
      });

      socket.emit('cursor-move', {
        roomId,
        userId: socket.id,
        position: currentPos,
      });
    }

    setPrevPos(currentPos);
  }, [isDrawing, prevPos, getCanvasCoordinates, drawLine, color, lineWidth, socket, roomId]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    setPrevPos(null);

    if (socket) {
      socket.emit('draw-end', { roomId });
    }
  }, [socket, roomId]);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (socket) {
      socket.emit('clear-canvas', { roomId });
    }
  }, [socket, roomId]);

  const replayDrawing = useCallback((drawingData) => {
    if (!canvasRef.current || !drawingData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    drawingData.forEach((command) => {
      if (command.type === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (command.type === 'stroke') {
        const { start, end, color, lineWidth } = command.data;
        if (start && end) {
          drawLine(ctx, start, end, color, lineWidth);
        }
      }
    });
  }, [drawLine, canvasRef]);

  useEffect(() => {
    if (!socket) return;

    const handleRemoteDrawStart = ({ start }) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
    };

    const handleRemoteDrawMove = ({ start, end, color, lineWidth }) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      drawLine(ctx, start, end, color, lineWidth);
    };

    const handleRemoteClear = () => {
      clearCanvas();
    };

    const handleSetColor = (newColor) => setColor(newColor);
    const handleSetSize = (newSize) => setLineWidth(newSize);

    socket.on('draw-start', handleRemoteDrawStart);
    socket.on('draw-move', handleRemoteDrawMove);
    socket.on('clear-canvas', handleRemoteClear);
    socket.on('set-color', handleSetColor);
    socket.on('set-size', handleSetSize);

    return () => {
      socket.off('draw-start', handleRemoteDrawStart);
      socket.off('draw-move', handleRemoteDrawMove);
      socket.off('clear-canvas', handleRemoteClear);
      socket.off('set-color', handleSetColor);
      socket.off('set-size', handleSetSize);
    };
  }, [socket, drawLine, clearCanvas]);

  return {
    startDrawing,
    draw,
    endDrawing,
    clearCanvas,
    replayDrawing,
    setColor,
    setLineWidth,
    color,
    lineWidth,
  };
};

export default useDrawing;
