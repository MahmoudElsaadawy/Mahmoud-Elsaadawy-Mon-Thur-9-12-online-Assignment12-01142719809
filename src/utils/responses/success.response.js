export const successResponse = ({ res, statusCode = 201, message, data }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
