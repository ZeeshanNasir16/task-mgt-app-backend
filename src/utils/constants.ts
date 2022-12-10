const constants = {
  defaultServiceResponse: {
    status: 400,
    message: '',
    body: {},
  },
  resourceMessage: (resource: string) => {
    RESOURCE_CREATED: `${resource} created successfully`;
    RESOURCE_FETCHED: `${resource} fetched successfully`;
    RESOURCE_UPDATED: `${resource} updated successfully`;
    RESOURCE_DELETED: `${resource} deleted successfully`;
    RESOURCE_NOT_FOUND: `${resource} not found`;
  },

  userMessage: {
    SIGNUP_SUCCESS: 'Signup success',
    SIGNIN_SUCCESS: 'Signin success',
    DUPLICATE_EMAIL: 'User already exists with given email',
    USER_NOT_FOUND: 'User not found',
    INVALID_PASSWORD: 'Incorrect password',
  },
  requestValidationMessage: {
    BAD_REQUEST: 'Invalid fields',
    INVALID_ID: 'Invalid id',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_MISSING: 'Token missing from headers',
  },
  dbConnectionMessage: {
    DB_CONNECTION_SUCCESS: 'Database connected successfully',
    DB_CONNECTION_FAIL: 'Database connectivity error',
  },
};

export default constants;
