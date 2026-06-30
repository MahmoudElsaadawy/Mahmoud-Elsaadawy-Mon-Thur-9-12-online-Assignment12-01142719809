export const errorResponse = ({ message, statusCode }) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = typeof message == "string" ? message : message.message;
  throw error;
};

export const conflictException = (message) => {
  errorResponse({ message, statusCode: 409 });
};

export const notFoundException = (message) => {
  errorResponse({ message, statusCode: 404 });
};

export const badRequestException = (message) => {
  errorResponse({ message, statusCode: 400 });
};

export const unauthorizedException = (message) => {
  errorResponse({ message, statusCode: 404 });
};

export const forbiddenException = (message) => {
  errorResponse({ message, statusCode: 401 });
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Unexpected Error",
    stack: err.stack || undefined,
  });
};
