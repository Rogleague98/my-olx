import React from 'react';
import { categories } from '../constants';

type CategoryMenuProps = {
  onCategorySelect?: (cat: string) => void;
  onSubcategorySelect?: (cat: string, sub: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
  inline?: boolean;
};

export default function CategoryMenu({
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  inline,
}: CategoryMenuProps) {
  const selectedCatObj = categories.find(cat => cat.name === selectedCategory);
  return (
    <div className={`flex gap-x-4 items-center w-full`}>
      {/* Category Dropdown */}
      <select
        className="flex-1 h-14 pl-4 pr-10 rounded-2xl border border-blue-700 bg-white text-black font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:bg-blue-50 focus:bg-blue-100 transition-all duration-300"
        value={selectedCategory || ''}
        onChange={e => {
          const val = e.target.value;
          if (onCategorySelect) onCategorySelect(val);
        }}
      >
        <option value="">Category...</option>
        {categories.map(cat => (
          <option key={cat.name} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      {/* Subcategory Dropdown (locked until category is chosen) */}
      <select
        className={`flex-1 h-14 pl-4 pr-10 rounded-2xl border border-blue-700 bg-white text-black font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:bg-blue-50 focus:bg-blue-100 transition-all duration-300${!selectedCategory ? ' opacity-60' : ''}`}
        value={selectedSubcategory || ''}
        onChange={e => {
          const val = e.target.value;
          if (onSubcategorySelect && selectedCategory) onSubcategorySelect(selectedCategory, val);
        }}
        disabled={!selectedCategory}
      >
        <option value="">{selectedCategory ? 'Subcategory...' : 'Select category first'}</option>
        {selectedCatObj && selectedCatObj.subcategories.map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
    </div>
  );
} 