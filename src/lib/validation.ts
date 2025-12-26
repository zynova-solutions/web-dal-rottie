// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (international format)
export const isValidPhone = (phone: string): boolean => {
  // Basic regex for international phone numbers with optional country code
  const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
};

// Required field validation
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Date validation (ensures date is in the future)
export const isFutureDate = (dateStr: string): boolean => {
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  return selectedDate >= today;
};

// Generic form field validation with multiple rules
export interface ValidationRule {
  validate: (value: string) => boolean;
  errorMessage: string;
}

export const validateField = (value: string, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.errorMessage;
    }
  }
  return null; // No errors
}; 