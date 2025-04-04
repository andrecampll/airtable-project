import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { TimelineItem } from '../../types';

const TimelineItemComponent: React.FC<{
  item: TimelineItem;
  laneIndex: number;
  style: React.CSSProperties;
  isEditing: boolean;
  editValue: string;
  onMouseEnter: (item: TimelineItem, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onClick: (item: TimelineItem) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEditBlur: () => void;
  onItemUpdate?: (updatedItem: TimelineItem) => void;
  getDateFromPosition: (clientX: number) => Date;
}> = ({
  item,
  laneIndex,
  style,
  isEditing,
  editValue,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onEditChange,
  onEditKeyDown,
  onEditBlur,
  onItemUpdate,
  getDateFromPosition
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<'left' | 'right' | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TimelineItem category:', item.category);
  }, [item.category]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TIMELINE_ITEM',
    item: { type: 'TIMELINE_ITEM', id: item.id, start: item.start, end: item.end, laneIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [item, laneIndex]);

  const handleResizeStart = (e: React.MouseEvent, edge: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
  };

  useEffect(() => {
    if (!isResizing || !resizeEdge || !onItemUpdate) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newDate = getDateFromPosition(e.clientX);
      const updatedItem = { ...item };

      if (resizeEdge === 'left') {
        updatedItem.start = newDate.toISOString();
      } else {
        updatedItem.end = newDate.toISOString();
      }

      onItemUpdate(updatedItem);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeEdge(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeEdge, item, onItemUpdate, getDateFromPosition]);

  return (
    <div
      ref={(node) => {
        drag(node);
        itemRef.current = node;
      }}
      className={`timeline-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1
      }}
      data-category={item.category || 'default'}
      onMouseEnter={(e) => onMouseEnter(item, e)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(item)}
    >
      <div
        className="timeline-item-resize-handle left"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <div
        className="timeline-item-resize-handle right"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
      <div className="timeline-item-content">
        {isEditing ? (
          <input
            type="text"
            className="timeline-item-name-edit"
            value={editValue}
            onChange={onEditChange}
            onKeyDown={onEditKeyDown}
            onBlur={onEditBlur}
            autoFocus
          />
        ) : (
          <div className="timeline-item-name">{item.name}</div>
        )}
        <div className="timeline-item-dates">
          {item.start} - {item.end}
        </div>
      </div>
    </div>
  );
};

export default TimelineItemComponent; 