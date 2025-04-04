import React from 'react';

type ZoomControlsProps = {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomLevel, onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="zoom-controls">
      <button onClick={onZoomOut} className="zoom-button" title="Zoom Out (Ctrl+-)">
        <span>-</span>
      </button>
      <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
      <button onClick={onZoomIn} className="zoom-button" title="Zoom In (Ctrl+=)">
        <span>+</span>
      </button>
      <button onClick={onReset} className="zoom-button" title="Reset Zoom (Ctrl+0)">
        <span>↺</span>
      </button>
    </div>
  );
};

export default ZoomControls; 