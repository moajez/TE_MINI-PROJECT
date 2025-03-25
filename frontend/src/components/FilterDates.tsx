import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { nationalHolidays, holidayNames } from '../utils/holidays';

interface FilterDatesProps {
  course: Course;
  onUpdate: (course: Course) => void;
}

export const FilterDates: React.FC<FilterDatesProps> = ({ course, onUpdate }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const start = new Date(course.startDate);
    const end = new Date(course.endDate);

    const holidaysInRange = nationalHolidays.filter(holiday => {
      const holidayDate = new Date(holiday);
      return holidayDate >= start && holidayDate <= end;
    });

    if (course.excludeHolidays) {
      const updatedExcludedDates = Array.from(new Set([...course.excludedDates, ...holidaysInRange])).sort();
      onUpdate({ ...course, excludedDates: updatedExcludedDates });
    } else {
      const updatedExcludedDates = course.excludedDates.filter(date => !holidaysInRange.includes(date));
      onUpdate({ ...course, excludedDates: updatedExcludedDates });
    }
  }, [course.excludeHolidays, course.startDate, course.endDate]);

  const addExcludedDate = (date: string) => {
    if (!course.excludedDates.includes(date)) {
      onUpdate({
        ...course,
        excludedDates: [...course.excludedDates, date].sort()
      });
    }
  };

  const removeExcludedDate = (date: string) => {
    onUpdate({
      ...course,
      excludedDates: course.excludedDates.filter(d => d !== date)
    });
  };

  const removeDatesInRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const datesToRemove: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      datesToRemove.push(d.toISOString().split('T')[0]);
    }

    const updatedExcludedDates = Array.from(new Set([...course.excludedDates, ...datesToRemove])).sort();
    onUpdate({ ...course, excludedDates: updatedExcludedDates });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Filter Dates</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={course.excludeHolidays}
            onChange={(e) => onUpdate({ ...course, excludeHolidays: e.target.checked })}
            className="rounded bg-gray-700 border-gray-600"
          />
          <label className="ml-2 text-gray-300">Remove National Holidays</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Remove Dates in Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="End Date"
            />
            <button
              onClick={removeDatesInRange}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Remove Dates in Range
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Add Date to Exclude</label>
          <input
            type="date"
            onChange={(e) => addExcludedDate(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Excluded Dates</label>
          <div className="space-y-2">
            {course.excludedDates.map(date => (
              <div key={date} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="text-white">
                  {date} {holidayNames[date] ? `(${holidayNames[date]})` : ''}
                </span>
                <button
                  onClick={() => removeExcludedDate(date)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};