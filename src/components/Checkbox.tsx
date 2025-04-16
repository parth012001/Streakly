// New component: src/components/Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <div 
      className={`
        w-6 h-6 rounded-full border-2 cursor-pointer
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${checked 
          ? 'border-green-500 bg-green-500' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      onClick={onChange}
    >
      {checked && (
        <svg 
          className="w-4 h-4 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      )}
    </div>
  );
};

export default Checkbox;