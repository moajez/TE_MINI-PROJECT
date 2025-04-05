export const generateCSV = (schedule: string[], course: any): string => {
  const headers = ['Week', 'Date', 'Course', 'Code'];
  const rows = schedule.map((date, index) => {
    const week = Math.floor(index / course.selectedDays.length) + 1;
    return `${week},${date},${course.name},${course.code}`;
  });
  
  return [headers.join(','), ...rows].join('\n');
};