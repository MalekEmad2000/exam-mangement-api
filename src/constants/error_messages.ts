// Error messages constants

export const ResponseMessages = {
  // 200
  OK: 'OK',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
  ERROR: 'Error',

  // Error messages
  // 400
  BAD_REQUEST: 'Bad Request',
  // 401
  UNAUTHORIZED: 'Unauthorized',
  // 403
  FORBIDDEN: 'Forbidden',
  // 404
  NOT_FOUND: 'Not Found',
  // 409
  CONFLICT: 'Conflict',
  // 500
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  // 503
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  // 504
  GATEWAY_TIMEOUT: 'Gateway Timeout',

  // Custom error messages
  EXAM_NOT_FOUND: 'Exam not found',
  EXAM_ALREADY_SUBMITTED: 'Exam already submitted',
  STUDENT_NOT_FOUND: 'Student not found',
  STUDENT_ALREADY_REGISTERED: 'Student already registered',
  LOGIN_UNAUTHORIZED: 'Wrong username or password',
  ID_ERROR: 'Invalid id',
  STUDENT_ANSWERS_NOT_CREATED: 'Student answers not created',

  // Custom success messages
  ALREADY_LOGGED_IN: 'Already logged in',
  EXAM_SUBMITTED: 'Exam submitted',
  STUDENT_FOUND: 'Student found',
  EXAMS_FETCHED: 'Exams fetched successfully',
  LOGIN_SUCCESS: 'Login successful',
  STUDENT_ANSWERS_CREATED: 'Student answers created',
  LOGOUT_SUCCESS: 'Logout successful',
  STUDENT_ALREADY_SUBMITTED: 'Student already submitted',
};
