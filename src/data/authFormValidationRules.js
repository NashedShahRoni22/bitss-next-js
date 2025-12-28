export const authFormValidationRules = {
  password: {
    minLength: {
      value: 13,
      message:
        "Password must be at least 13 characters long and contain uppercase, lowercase, number and two special characters",
    },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d].*[^A-Za-z\d]).{13,}$/,
      message:
        "Password must contain at least one uppercase, one lowercase, one number and two special characters",
    },
  },

  contactEmail: {
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please provide a valid email address",
    },
  },

  terms: {
    required:
      "You must agree to the Terms of Services and Privacy Policy to continue",
  },
};
