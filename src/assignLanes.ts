import { TimelineItem } from './types';

/**
 * Takes an array of items and assigns them to lanes based on start/end dates and lane property.
 * @returns an array of arrays containing items.
 */
export function assignLanes(items: TimelineItem[]): TimelineItem[][] {
  // First, sort items by their assigned lane (if any) and then by start date
  const sortedItems = items.sort((a, b) => {
    // If both items have a lane assigned, sort by lane first
    if (a.lane !== undefined && b.lane !== undefined) {
      if (a.lane !== b.lane) {
        return a.lane - b.lane;
      }
    }
    // Then sort by start date
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  const lanes: TimelineItem[][] = [];

  function assignItemToLane(item: TimelineItem): void {
    // If the item has a lane assigned, ensure that lane exists
    if (item.lane !== undefined) {
      while (lanes.length <= item.lane) {
        lanes.push([]);
      }
      lanes[item.lane].push(item);
      return;
    }

    // Otherwise, try to find a suitable lane
    for (const lane of lanes) {
      // Skip empty lanes
      if (lane.length === 0) continue;
      
      if (new Date(lane[lane.length - 1].end).getTime() < new Date(item.start).getTime()) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  }

  for (const item of sortedItems) {
    assignItemToLane(item);
  }
  return lanes;
} 