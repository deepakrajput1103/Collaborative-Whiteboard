import React from 'react';

const Toolbar = ({ setColor, setLineWidth, clearCanvas }) => {
  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00'];
  const sizes = [2, 5, 10, 15];

  return (
    <div className="toolbar">
      <div className="color-picker">
        {colors.map((color) => (
          <button
            key={color}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => setColor(color)}
          />
        ))}
      </div>
      <div className="size-picker">
        {sizes.map((size) => (
          <button
            key={size}
            className="size-option"
            onClick={() => setLineWidth(size)}
          >
            {size}px
          </button>
        ))}
      </div>
      <button className="clear-btn" onClick={clearCanvas}>
        Clear Canvas
      </button>
    </div>
  );
};

export default Toolbar;
