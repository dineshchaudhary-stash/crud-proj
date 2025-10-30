// src/utils/validation.ts

// Basic email regex
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// India-style 6-digit pincode. Adjust regex for other countries/formats.
export const validatePincode = (pincode: string): boolean => {
  if (!pincode) return false;
  const pinRegex = /^[0-9]{6}$/;
  return pinRegex.test(pincode);
  
};

export const validateName = (name: string): boolean => {
  if (!name) return false;
  return /^[A-Za-z]+(?:[ A-Za-z-']+)*$/.test(name.trim());
};

// Check for missing required fields in an object.
// Returns array of missing field names
export const validateRequiredFields = (obj: Record<string, any>, fields: string[]): string[] => {
  const missing: string[] = [];
  fields.forEach((f) => {
    const val = obj[f];
    // treat null/undefined/'' as missing
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      missing.push(f);
    }
  });
  return missing;
};
