export const validateStep = (currentStep: string, course: any): boolean => {
  switch (currentStep) {
    case 'home':
      return Boolean(course.name && course.code);
    case 'dateRange':
      return Boolean(course.startDate && course.endDate);
    case 'weekdays':
      return course.selectedDays.length > 0;
    case 'filter':
      return true;
    default:
      return false;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};