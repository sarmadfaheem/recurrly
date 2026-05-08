const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Use at least 8 characters";
  if (!/[A-Z]/.test(value) || !/[0-9]/.test(value))
    return "Mix uppercase letters and numbers";
  return null;
};

export const validateRequired = (
  value: string,
  field: string,
): string | null => {
  if (!value.trim()) return `${field} is required`;
  return null;
};

export const validateCode = (value: string): string | null => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Enter the code we sent";
  if (digits.length < 6) return "Code must be 6 digits";
  return null;
};
