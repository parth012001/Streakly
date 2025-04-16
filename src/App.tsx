import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HabitCard from './components/HabitCard';
import StreakCelebration from './components/StreakCelebrations';
import Modal from './components/Modal';
import AddHabitForm from './components/AddHabitForm';
import { categories, Category } from './config/categories';
import CategoryTag from './components/CategoryTag';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  lastCompletedDate?: string;
  goal?: string;
  targetDays?: number;
  categoryId: string;
}

interface SortableHabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
}

const STORAGE_KEY = 'streakly-habits';

const defaultHabits: Habit[] = [
  { id: 1, name: 'Morning Exercise', streak: 3, completed: false, categoryId: 'health' },
  { id: 2, name: 'Read 30 minutes', streak: 5, completed: false, categoryId: 'learning' },
  { id: 3, name: 'Meditate', streak: 2, completed: false, categoryId: 'mindfulness' },
];

const SortableHabitCard: React.FC<SortableHabitCardProps> = ({ habit, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative ${isDragging ? 'z-50' : 'z-0'}`}
      {...attributes}
    >
      <div 
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 cursor-move flex items-center justify-center opacity-30 hover:opacity-60"
      >
        <div className="flex flex-col gap-1">
          <div className="w-1 h-1 rounded-full bg-gray-400" />
          <div className="w-1 h-1 rounded-full bg-gray-400" />
          <div className="w-1 h-1 rounded-full bg-gray-400" />
        </div>
      </div>
      <div className={isDragging ? 'opacity-50' : ''}>
        <HabitCard
          name={habit.name}
          streak={habit.streak}
          completed={habit.completed}
          categoryId={habit.categoryId}
          goal={habit.goal}
          targetDays={habit.targetDays}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    // Load habits from localStorage on initial render
    const savedHabits = localStorage.getItem(STORAGE_KEY);
    return savedHabits ? JSON.parse(savedHabits) : defaultHabits;
  });

  const [celebration, setCelebration] = useState<{
    isVisible: boolean;
    streak: number;
    habitName: string;
  }>({
    isVisible: false,
    streak: 0,
    habitName: ''
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Save to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Daily reset effect - now runs once per day
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      setHabits(currentHabits => 
        currentHabits.map(habit => {
          if (habit.lastCompletedDate && habit.lastCompletedDate < yesterday) {
            return {
              ...habit,
              completed: false,
              streak: 0,
              lastCompletedDate: undefined
            };
          }
          if (habit.lastCompletedDate !== today) {
            return {
              ...habit,
              completed: false
            };
          }
          return habit;
        })
      );
    };

    // Check on mount
    checkDailyReset();

    // Set up interval to check every minute
    const interval = setInterval(checkDailyReset, 60000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run on mount

  const toggleHabit = (id: number) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(currentHabits => 
      currentHabits.map(habit => {
        if (habit.id !== id) return habit;

        const isCompletingNow = !habit.completed;
        let newStreak = habit.streak;

        if (isCompletingNow) {
          newStreak = habit.streak + 1;
          
          // Use a separate effect for celebration to avoid state conflicts
          requestAnimationFrame(() => {
            setCelebration({
              isVisible: true,
              streak: newStreak,
              habitName: habit.name
            });
            
            setTimeout(() => {
              setCelebration(prev => ({ ...prev, isVisible: false }));
            }, 2000);
          });
        } else {
          newStreak = Math.max(0, habit.streak - 1);
        }

        return {
          ...habit,
          completed: isCompletingNow,
          lastCompletedDate: isCompletingNow ? today : undefined,
          streak: newStreak
        };
      })
    );
  };

  const handleAddHabit = (habitData: {
    name: string;
    goal?: string;
    targetDays?: number;
    categoryId: string;
  }) => {
    const newHabit: Habit = {
      id: Date.now(),
      name: habitData.name,
      streak: 0,
      completed: false,
      goal: habitData.goal,
      targetDays: habitData.targetDays,
      categoryId: habitData.categoryId,
    };

    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const filteredHabits = selectedCategory
    ? habits.filter(habit => habit.categoryId === selectedCategory)
    : habits;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Good Morning, Parth <span className="wave">👋</span>
          </h1>
          <p className="text-gray-400">
            Track your daily habits and build a better routine
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-300 mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${!selectedCategory 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}
              `}
            >
              All Habits
            </button>
            {categories.map(category => (
              <CategoryTag
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredHabits}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredHabits.map((habit) => (
                  <SortableHabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() => toggleHabit(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {filteredHabits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {selectedCategory 
                  ? "No habits in this category yet"
                  : "No habits added yet"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Add new habit"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </main>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddHabitForm
          onSubmit={handleAddHabit}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      <StreakCelebration 
        streak={celebration.streak}
        isVisible={celebration.isVisible}
      />
    </div>
  );
};

export default App;
