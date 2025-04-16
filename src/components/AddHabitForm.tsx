import React, { useState } from 'react';
import { categories } from '../config/categories';

interface AddHabitFormProps {
  onSubmit: (habitData: {
    name: string;
    goal?: string;
    targetDays?: number;
    categoryId: string;
  }) => void;
  onClose: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onSubmit, onClose }) => {
  const [habitData, setHabitData] = useState({
    name: '',
    goal: '',
    targetDays: 0,
    categoryId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitData.name.trim() && habitData.categoryId) {
      onSubmit(habitData);
      onClose();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add New Habit</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">
            Habit Name *
          </label>
          <input
            type="text"
            id="habit-name"
            value={habitData.name}
            onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Morning Exercise"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setHabitData({ ...habitData, categoryId: category.id })}
                className={`
                  flex items-center space-x-2 p-3 rounded-lg border-2 transition-all
                  ${habitData.categoryId === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="habit-goal" className="block text-sm font-medium text-gray-700">
            Goal (optional)
          </label>
          <input
            type="text"
            id="habit-goal"
            value={habitData.goal}
            onChange={(e) => setHabitData({ ...habitData, goal: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Exercise for 30 minutes"
          />
        </div>

        <div>
          <label htmlFor="target-days" className="block text-sm font-medium text-gray-700">
            Target Days to Build Habit
          </label>
          <select
            id="target-days"
            value={habitData.targetDays}
            onChange={(e) => setHabitData({ ...habitData, targetDays: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={0}>Select target</option>
            <option value={21}>21 days</option>
            <option value={30}>30 days</option>
            <option value={66}>66 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!habitData.name.trim() || !habitData.categoryId}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Habit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;
