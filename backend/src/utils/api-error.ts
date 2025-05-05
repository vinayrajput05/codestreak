class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number, // HTTP status code
    message: string = 'Something went wrong', // Default message
    errors: any[] = [], // Validation/internal errors
    stack: string = '', // Optional stack trace
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
