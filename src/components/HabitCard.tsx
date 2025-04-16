import React, { useState } from 'react';
import { categories } from '../config/categories';

interface HabitCardProps {
  name: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  categoryId: string;
  goal?: string;
  targetDays?: number;
}

const HabitCard: React.FC<HabitCardProps> = ({
  name,
  streak,
  completed,
  onToggle,
  onDelete,
  categoryId,
  goal,
  targetDays,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const category = categories.find(c => c.id === categoryId);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className={`
            w-6 h-6
            border-2 rounded-lg
            transition-all duration-300
            transform hover:scale-110
            ${completed ? 'border-green-500 bg-green-500' : 'border-gray-400'}
            hover:border-green-400
            cursor-pointer
          `}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={`
              text-lg font-medium truncate
              transition-all duration-300
              ${completed ? 'text-gray-400 line-through' : 'text-white'}
            `}>
              {name}
            </span>
          </div>
          
          {category && (
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
              ${category.color}
            `}>
              {category.icon} {category.name}
            </span>
          )}
          
          {(goal || targetDays) && (
            <div className="text-sm text-gray-300 mt-2">
              <div className="flex items-center space-x-2">
                {goal && <span>🎯 Goal: {goal}</span>}
                {targetDays && (
                  <>
                    <span>•</span>
                    <span>📅 Target: {targetDays} days</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg
            transition-all duration-300
            ${completed 
              ? 'bg-green-500/20 text-green-400 scale-110' 
              : 'bg-gray-700 text-gray-300'
            }
          `}>
            <span className={`
              transform transition-all duration-300
              ${completed ? 'rotate-12' : ''}
            `}>
              🔥
            </span>
            <span className="font-semibold">{streak}</span>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center space-y-4">
          <p className="text-white">Delete this habit?</p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard; 