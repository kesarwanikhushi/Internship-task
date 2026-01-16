// Password validation utility

export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasNumber: /\d/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password)
  };

  const isValid = checks.length && checks.hasSpecialChar;
  
  return {
    isValid,
    checks,
    strength: calculateStrength(checks)
  };
};

const calculateStrength = (checks) => {
  const passedChecks = Object.values(checks).filter(Boolean).length;
  if (passedChecks <= 2) return 'weak';
  if (passedChecks <= 3) return 'medium';
  return 'strong';
};

export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-slate-300';
  }
};
