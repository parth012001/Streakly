// src/config/categories.ts
export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
  }
  
  export const categories: Category[] = [
    {
      id: 'health',
      name: 'Health & Fitness',
      color: 'bg-green-100 text-green-800',
      icon: '💪'
    },
    {
      id: 'learning',
      name: 'Learning',
      color: 'bg-blue-100 text-blue-800',
      icon: '📚'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      color: 'bg-purple-100 text-purple-800',
      icon: '🧘'
    },
    {
      id: 'productivity',
      name: 'Productivity',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⚡'
    },
    {
      id: 'creativity',
      name: 'Creativity',
      color: 'bg-pink-100 text-pink-800',
      icon: '🎨'
    }
  ];
  
  export const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };