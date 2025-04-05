export const nationalHolidays = [
  '2025-01-26', // Republic Day
  '2025-03-21', // Holi
  '2025-04-14', // Dr. Ambedkar Jayanti
  '2025-04-18', // Good Friday
  '2025-05-01', // Labour Day
  '2025-08-15', // Independence Day
  '2025-08-19', // Raksha Bandhan
  '2025-09-05', // Teachers' Day
  '2025-10-02', // Gandhi Jayanti
  '2025-10-22', // Dussehra
  '2025-11-01', // Diwali
  '2025-11-02', // Diwali Holiday
  '2025-11-14', // Children's Day
  '2025-12-25', // Christmas Day
  // Add more holidays as needed
];

export const holidayNames: { [key: string]: string } = {
  '2025-01-26': 'Republic Day',
  '2025-03-21': 'Holi',
  '2025-04-14': 'Dr. Ambedkar Jayanti',
  '2025-04-18': 'Good Friday',
  '2025-05-01': 'Labour Day',
  '2025-08-15': 'Independence Day',
  '2025-08-19': 'Raksha Bandhan',
  '2025-09-05': 'Teachers\' Day',
  '2025-10-02': 'Gandhi Jayanti',
  '2025-10-22': 'Dussehra',
  '2025-11-01': 'Diwali',
  '2025-11-02': 'Diwali Holiday',
  '2025-11-14': 'Children\'s Day',
  '2025-12-25': 'Christmas Day',
  // Add more holidays as needed
};

export const isNationalHoliday = (date: string): boolean => {
  return nationalHolidays.includes(date);
};