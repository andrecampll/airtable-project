import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { TimelineItem } from '../types';

type TooltipPosition = {
  x: number;
  y: number;
};

type TooltipProps = {
  item: TimelineItem;
  position: TooltipPosition;
};

const Tooltip: React.FC<TooltipProps> = ({ item, position }) => {
  if (!item) return null;
  
  return (
    <div 
      className="timeline-tooltip"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      <div className="tooltip-name">{item.name}</div>
      <div className="tooltip-dates">
        <div>Start: {formatDate(new Date(item.start))}</div>
        <div>End: {formatDate(new Date(item.end))}</div>
      </div>
    </div>
  );
};

export default Tooltip; 