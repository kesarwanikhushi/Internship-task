const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  return { isValid: true };
};

const validateName = (name) => {
  if (!name || name.trim().length < 3 || name.trim().length > 50) {
    return {
      isValid: false,
      message: 'Name must be between 3 and 50 characters',
    };
  }
  return { isValid: true };
};

const validateTaskTitle = (title) => {
  if (!title || title.trim().length < 3) {
    return {
      isValid: false,
      message: 'Task title must be at least 3 characters',
    };
  }
  return { isValid: true };
};

const validateTaskDescription = (description) => {
  if (!description || description.trim().length < 10) {
    return {
      isValid: false,
      message: 'Task description must be at least 10 characters',
    };
  }
  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateTaskTitle,
  validateTaskDescription,
};
