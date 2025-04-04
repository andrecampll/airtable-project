import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Timeline.css';
import Tooltip from '../Tooltip.tsx';
import DateAxis from './DateAxis.tsx';
import ZoomControls from './ZoomControls.tsx';
import TimelineLaneComponent from './TimelineLane.tsx';
import TimelineItemComponent from './TimelineItem.tsx';
import SearchBar from '../SearchBar';
import { TimelineItem } from '../../types';
import { assignLanes } from '../../assignLanes.ts';

type TimelineProps = {
  items: TimelineItem[];
  onItemUpdate?: (updatedItem: TimelineItem) => void;
};

type TooltipPosition = {
  x: number;
  y: number;
};

const Timeline: React.FC<TimelineProps> = ({ items, onItemUpdate }) => {
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Tooltip state
  const [tooltipItem, setTooltipItem] = useState<TimelineItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  // Edit state
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // New state for search and filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Timeline container ref
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Calculate the date range for scaling
  const dateRange = useMemo(() => {
    if (items.length === 0) return { min: new Date(), max: new Date() };
    
    const dates = items.flatMap(item => [
      new Date(item.start),
      new Date(item.end)
    ]);
    
    return {
      min: new Date(Math.min(...dates.map(d => d.getTime()))),
      max: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }, [items]);

  // Filter items based on search query and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category).filter((category): category is string => category !== undefined)));
  }, [items]);

  // Assign items to lanes
  const lanes = useMemo(() => {
    return assignLanes(filteredItems);
  }, [filteredItems]);

  // Convert position to date
  const getDateFromPosition = useCallback((clientX: number): Date => {
    if (!timelineRef.current) return new Date();
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = relativeX / rect.width;
    const totalDays = dateRange.max.getTime() - dateRange.min.getTime();
    const daysFromStart = percentage * totalDays;
    const date = new Date(dateRange.min.getTime() + daysFromStart);
    
    // Snap to day
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }, [dateRange]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 10));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Tooltip handlers
  const handleItemMouseEnter = useCallback((item: TimelineItem, e: React.MouseEvent<HTMLDivElement>) => {
    if (editingItem) return; // Don't show tooltip while editing
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipItem(item);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  }, [editingItem]);
  
  const handleItemMouseLeave = useCallback(() => {
    if (editingItem) return; // Don't hide tooltip while editing
    setTooltipItem(null);
  }, [editingItem]);

  // Edit handlers
  const handleItemClick = useCallback((item: TimelineItem) => {
    setEditingItem(item);
    setEditValue(item.name);
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingItem && editValue.trim()) {
      const updatedItem = { ...editingItem, name: editValue.trim() };
      onItemUpdate?.(updatedItem);
      setEditingItem(null);
      setEditValue('');
    }
  }, [editingItem, editValue, onItemUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditingItem(null);
    setEditValue('');
  }, []);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  // Keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  // Calculate position and width based on dates and zoom level
  const getItemStyle = useCallback((item: TimelineItem) => {
    const startDate = new Date(item.start);
    const endDate = new Date(item.end);
    
    const totalDays = (dateRange.max.getTime() - dateRange.min.getTime()) / (1000 * 60 * 60 * 24);
    const startDays = (startDate.getTime() - dateRange.min.getTime()) / (1000 * 60 * 60 * 24);
    const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const left = (startDays / totalDays) * 100;
    const width = (durationDays / totalDays) * 100;
    
    const minWidth = Math.max(5, 5 / zoomLevel);
    const finalWidth = Math.max(width, minWidth);
    
    return {
      left: `${left}%`,
      width: `${finalWidth}%`
    };
  }, [dateRange, zoomLevel]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="timeline-container">
        <div className="timeline-header">
          <SearchBar
            onSearch={setSearchQuery}
            onCategoryFilter={setSelectedCategory}
            categories={categories}
          />
          <ZoomControls 
            zoomLevel={zoomLevel} 
            onZoomIn={handleZoomIn} 
            onZoomOut={handleZoomOut} 
            onReset={handleResetZoom} 
          />
        </div>
        <div className="timeline" ref={timelineRef}>
          <div className="timeline-content">
            <div 
              className="timeline-content-wrapper" 
              style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'left top'
              }}
            >
              <DateAxis dateRange={dateRange} zoomLevel={zoomLevel} />
              {lanes.map((lane, laneIndex) => (
                <TimelineLaneComponent
                  key={laneIndex}
                  laneIndex={laneIndex}
                  items={filteredItems}
                  onItemUpdate={onItemUpdate}
                  getDateFromPosition={getDateFromPosition}
                >
                  {lane.map((item) => (
                    <TimelineItemComponent
                      key={item.id}
                      item={item}
                      laneIndex={laneIndex}
                      style={getItemStyle(item)}
                      isEditing={editingItem?.id === item.id}
                      editValue={editValue}
                      onMouseEnter={handleItemMouseEnter}
                      onMouseLeave={handleItemMouseLeave}
                      onClick={handleItemClick}
                      onEditChange={handleEditChange}
                      onEditKeyDown={handleEditKeyDown}
                      onEditBlur={handleEditSave}
                      onItemUpdate={onItemUpdate}
                      getDateFromPosition={getDateFromPosition}
                    />
                  ))}
                </TimelineLaneComponent>
              ))}
            </div>
          </div>
        </div>
        {tooltipItem && !editingItem && (
          <Tooltip item={tooltipItem} position={tooltipPosition} />
        )}
      </div>
    </DndProvider>
  );
};

export default Timeline; 