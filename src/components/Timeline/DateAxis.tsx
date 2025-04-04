import React, { useCallback } from 'react';
import { formatDate } from '../../utils/dateUtils.ts';

type DateRange = {
  min: Date;
  max: Date;
};

type DateAxisProps = {
  dateRange: DateRange;
  zoomLevel: number;
};

const DateAxis: React.FC<DateAxisProps> = ({ dateRange, zoomLevel }) => {
  const { min, max } = dateRange;
  const totalDays = (max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24);
  
  // Generate tick marks at reasonable intervals based on zoom level
  const getTickInterval = useCallback(() => {
    // Adjust interval based on zoom level
    const baseInterval = totalDays <= 30 ? 7 : 
                        totalDays <= 90 ? 14 : 
                        totalDays <= 365 ? 30 : 90;
    
    // Apply zoom level to interval
    return Math.max(1, Math.floor(baseInterval / zoomLevel));
  }, [totalDays, zoomLevel]);
  
  const interval = getTickInterval();
  
  const ticks = Array.from({ length: Math.floor(totalDays / interval) + 1 }, (_, i) => {
    const days = i * interval;
    const date = new Date(min);
    date.setDate(date.getDate() + days);
    const position = (days / totalDays) * 100;
    
    return (
      <div 
        key={days} 
        className="timeline-tick"
        style={{ left: `${position}%` }}
      >
        <div className="timeline-tick-label">{formatDate(date)}</div>
        <div className="timeline-tick-line"></div>
      </div>
    );
  });
  
  return <div className="timeline-axis">{ticks}</div>;
};

export default DateAxis; 