// src/components/CategoryTag.tsx
import React from 'react';
import { Category } from '../config/categories';

interface CategoryTagProps {
  category: Category;
  onClick?: () => void;
  selected?: boolean;
}

const CategoryTag: React.FC<CategoryTagProps> = ({ 
  category, 
  onClick,
  selected = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${category.color}
        ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
        border border-gray-700
      `}
    >
      <span className="mr-1.5">{category.icon}</span>
      {category.name}
    </button>
  );
};

export default CategoryTag;