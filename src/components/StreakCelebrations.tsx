import React, { useEffect, useState } from 'react';

interface StreakCelebrationProps {
  streak: number;
  isVisible: boolean;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({ streak, isVisible }) => {
  const [emojis] = useState(['🎉', '🔥', '⭐', '💪', '✨']);

  return (
    <div className={`
      fixed inset-0 flex items-center justify-center
      pointer-events-none
      transition-opacity duration-500
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className="relative">
        {emojis.map((emoji, index) => (
          <span
            key={index}
            className="absolute animate-celebration"
            style={{
              animation: `celebration 1s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              left: `${Math.sin(index) * 50}px`,
              top: `${Math.cos(index) * 50}px`
            }}
          >
            {emoji}
          </span>
        ))}
        <div className="text-4xl font-bold text-center z-10 relative animate-bounce">
          {streak} Day Streak! 🔥
        </div>
      </div>
    </div>
  );
};

export default StreakCelebration;
