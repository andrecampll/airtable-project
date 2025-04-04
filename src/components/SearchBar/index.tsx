import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  categories: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCategoryFilter, categories }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search timeline items..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <select
        onChange={(e) => onCategoryFilter(e.target.value || null)}
        className="category-filter"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar; 