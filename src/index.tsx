import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems";
import Timeline from "./components/Timeline/index";
import "./app.css";
import { TimelineItem } from "./types";

const App: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>(timelineItems);

  const handleItemUpdate = (updatedItem: TimelineItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  return (
    <div className="app">
      <h1>Airtable Timeline</h1>
      <Timeline items={items} onItemUpdate={handleItemUpdate} />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 