import { Course } from '../types';
import { isNationalHoliday } from './holidays';

export const generateSchedule = (course: Course): string[] => {
  const start = new Date(course.startDate);
  const end = new Date(course.endDate);
  const schedule: string[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const selectedDayIndices = course.selectedDays.map(day => dayNames.indexOf(day));
  const excludedDatesSet = new Set(course.excludedDates);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split('T')[0];
    if (course.excludeHolidays && isNationalHoliday(dateString)) {
      excludedDatesSet.add(dateString);
    }
    if (
      selectedDayIndices.includes(d.getDay()) && 
      !excludedDatesSet.has(dateString)
    ) {
      schedule.push(dateString);
    }
  }
  
  return schedule;
};