import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import  useDrawing  from '../hooks/useDrawing';

const DrawingCanvas = forwardRef(({ socket, roomId, initialDrawingData }, ref) => {
  const canvasRef = React.useRef(null);
  const {
    startDrawing,
    draw,
    endDrawing,
    clearCanvas,
    replayDrawing,
  } = useDrawing(canvasRef, socket, roomId);

  useImperativeHandle(ref, () => ({
    clearCanvas,
  }));

  useEffect(() => {
    if (initialDrawingData && initialDrawingData.length > 0) {
      replayDrawing(initialDrawingData);
    }
  }, [initialDrawingData, replayDrawing]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth * 0.8}
      height={window.innerHeight * 0.7}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
    />
  );
});

export default DrawingCanvas;