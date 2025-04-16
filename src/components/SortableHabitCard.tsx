// src/components/SortableHabitCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HabitCard from './HabitCard';

interface SortableHabitCardProps {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  categoryId: string;
  goal?: string;
  targetDays?: number;
  onToggle: () => void;
  onDelete: () => void;
  onOpenNotes: () => void;
  notesCount: number;
}

const SortableHabitCard: React.FC<SortableHabitCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

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
        <HabitCard {...props} />
      </div>
    </div>
  );
};

export default SortableHabitCard;