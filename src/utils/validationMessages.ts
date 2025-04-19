// utils/validationMessages.ts
export const messages = {
  required: (field: string) => `${field} is required`,
  mustBeString: (field: string) => `${field} must be a string`,
  lengthBetween: (field: string, min: number, max: number) => `${field} must be between ${min} and ${max} characters`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters long`,
  strongPassword: `${'Password'} must be strong (uppercase, lowercase, number, symbol)`,
  invalidEmail: 'Email is invalid',
  invalidDate: 'Date of birth must be a valid ISO8601 date (YYYY-MM-DD)',
  notFound: (field: string) => `${field} not found`,
  BAD_CREDENTIALS: 'Invalid username or password'
}
