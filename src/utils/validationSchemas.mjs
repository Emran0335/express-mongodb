export const createUserValidationSchemaForBody = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};

export const createUserValidationSchemaForQuery = {
  filter: {
    isString: true,
    notEmpty: {
      errorMessage: "Filter's value must not be empty",
    },
  },
  value: {
    isLength: {
      options: {
        min: 2,
        max: 10,
      },
      errorMessage: "Value must be at least 2-10 characters",
    },
  },
};
