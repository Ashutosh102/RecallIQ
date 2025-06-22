
export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters long");
  } else if (password.length >= 12) {
    score += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    feedback.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    feedback.push("Avoid repeating characters");
    score = Math.max(0, score - 1);
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    feedback.push("Avoid common patterns and words");
    score = Math.max(0, score - 1);
  }

  const isValid = feedback.length === 0 && password.length >= 8;

  return {
    isValid,
    score: Math.min(4, score),
    feedback
  };
};

export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-red-500";
  }
};
