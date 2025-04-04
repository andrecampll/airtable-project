# Airtable Timeline App ⏱️

A React-based timeline visualization component that efficiently arranges items in horizontal lanes, with support for zooming, dragging, and inline editing.

## Features ✨

- Efficient lane assignment algorithm to minimize vertical space usage
- Interactive zoom controls to adjust the timeline view 🔍
- Drag and drop functionality to modify item dates
- Inline editing for item names ✏️
- Tooltip support for better information display
- Date axis with automatic scaling

## What I Like About This Implementation 💪

1. **Efficient Space Utilization**: The lane assignment algorithm ensures optimal use of vertical space by allowing items to share lanes when they don't overlap in time.

2. **Component Architecture**: The code is organized into logical, reusable components (Timeline, TimelineItem, TimelineLane, DateAxis, ZoomControls) that follow React best practices.

3. **Interactive Features**: The implementation includes several user-friendly features like zooming, dragging, and inline editing that make the timeline more practical and engaging.

4. **TypeScript Integration**: The use of TypeScript provides better type safety and developer experience, making the code more maintainable.

5. **Responsive Design**: The timeline adapts well to different screen sizes and provides a smooth user experience with appropriate animations.

## What I Would Change 🔄

1. **Performance Optimization**: Implement virtualization for handling large datasets to improve rendering performance.

2. **State Management**: Consider using a more robust state management solution (like Redux or Zustand) for complex state interactions.

3. **Accessibility**: Add more ARIA attributes and keyboard navigation support for better accessibility.

4. **Testing**: Add comprehensive unit and integration tests for all components and functionality.

5. **Documentation**: Add more detailed comments and create a proper component documentation using Storybook.

## Design Decisions 🎨

1. **Component Structure**: Inspired by modern React patterns and the need for maintainability, the code is split into smaller, focused components.

2. **Styling Approach**: Used CSS modules for component-specific styling to avoid style conflicts and improve maintainability.

3. **Interaction Design**: The drag-and-drop and zoom features were designed to be intuitive and similar to popular timeline tools like Google Calendar.

4. **Visual Design**: The timeline uses a clean, modern aesthetic with subtle animations and clear visual hierarchy.

## Testing Strategy 🧪

If given more time, I would implement the following testing approach:

1. **Unit Tests**:
   - Test the lane assignment algorithm with various scenarios
   - Test individual components (TimelineItem, TimelineLane, etc.)
   - Test utility functions and date handling

2. **Integration Tests**:
   - Test component interactions (drag and drop, zoom, editing)
   - Test the complete timeline with different data sets
   - Test responsive behavior

3. **Performance Tests**:
   - Test rendering performance with large datasets
   - Test memory usage and optimization
   - Test browser compatibility

4. **End-to-End Tests**:
   - Test complete user workflows
   - Test error handling and edge cases
   - Test accessibility compliance

## Getting Started 🚀

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:1234`

## Dependencies 📦

- React
- TypeScript
- Parcel (for bundling)
- ESLint (for code quality)
- React-dnd (for drag and drop)
