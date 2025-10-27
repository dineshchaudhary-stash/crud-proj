// src/utils/errorHandler.ts
export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const handleError = (reply: any, error: any) => {
  // If it's our ApiError, use its status code; otherwise 500
  const status = error?.statusCode || 500;
  const message = error?.message || "Internal Server Error";

  // Optional: log the error server-side
  // console.error(error);

  reply.code(status).send({
    success: false,
    message,
  });
};
