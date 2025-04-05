import React from 'react';
import { Course } from '../types';

interface WeekdaySelectorProps {
  course: Course;
  onUpdate: (course: Course) => void;
}

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ course, onUpdate }) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    const newSelectedDays = course.selectedDays.includes(day)
      ? course.selectedDays.filter(d => d !== day)
      : [...course.selectedDays, day];
    onUpdate({ ...course, selectedDays: newSelectedDays });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Select Teaching Days</h2>
      <div className="grid grid-cols-2 gap-4">
        {weekdays.map(day => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`p-4 rounded-lg ${
              course.selectedDays.includes(day)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};