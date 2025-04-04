import React from 'react';
import { useDrop } from 'react-dnd';
import { TimelineItem } from '../../types';

type DragItem = {
  type: 'TIMELINE_ITEM';
  id: number;
  start: string;
  end: string;
  laneIndex: number;
};

type TimelineLaneProps = {
  laneIndex: number;
  items: TimelineItem[];
  onItemUpdate?: (updatedItem: TimelineItem) => void;
  getDateFromPosition: (clientX: number) => Date;
  children: React.ReactNode;
};

const TimelineLaneComponent: React.FC<TimelineLaneProps> = ({
  items,
  onItemUpdate,
  getDateFromPosition,
  children,
  laneIndex
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TIMELINE_ITEM',
    drop: (draggedItem: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const newDate = getDateFromPosition(clientOffset.x);
      const draggedStartDate = new Date(draggedItem.start);
      const draggedEndDate = new Date(draggedItem.end);
      const duration = draggedEndDate.getTime() - draggedStartDate.getTime();
      
      // Find the original item to preserve its properties
      const originalItem = items.find(i => i.id === draggedItem.id);
      
      // Create updated item with new position and lane, preserving the category
      const updatedItem = {
        id: draggedItem.id,
        name: originalItem?.name || '',
        start: newDate.toISOString().split('T')[0],
        end: new Date(newDate.getTime() + duration).toISOString().split('T')[0],
        lane: laneIndex,
        category: originalItem?.category // Preserve the category
      };
      
      onItemUpdate?.(updatedItem);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [items, onItemUpdate, getDateFromPosition, laneIndex]);

  return (
    <div 
      ref={drop as unknown as React.RefCallback<HTMLDivElement>}
      className={`timeline-lane ${isOver ? 'lane-over' : ''}`}
    >
      {children}
    </div>
  );
};

export default TimelineLaneComponent; 