import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { IAppError } from "../utils/AppError";

const validationError = (error: Error) => {
  return new AppError("Validation Error", error.message, 400);
};

const referenceError = (error: Error) => {
  return new AppError("Reference Error", error.message, 400);
};

const mongoServerError = (error: Error) => {
  return new AppError("Mongo Server Error", error.message, 400);
};

const typeError = (error: Error) => {
  return new AppError("Type Error", error.message, 400);
};

const castError = (error: Error) => {
  return new AppError(error.name, error.message, 400);
};

const tokenExpiredError = (error: Error) => {
  return new AppError(error.name, error.message, 404);
};

const sendErrorMessage = (
  error: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.statusCode).json({
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
  });
};

const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorMessage: IAppError = {
    type: "",
    message: "",
    statusCode: 0,
  };

  if (error.name === "ValidationError") {
    errorMessage = validationError(error);
  }

  if (error.name === "ReferenceError") {
    errorMessage = referenceError(error);
  }

  if (error.name === "MongoServerError") {
    errorMessage = mongoServerError(error);
  }

  if (error.name === "TypeError") {
    errorMessage = typeError(error);
  }

  if (error.name === "CastError") {
    errorMessage = castError(error);
  }

  if (error.name === "TokenExpiredError") {
    errorMessage = tokenExpiredError(error);
  }

  sendErrorMessage(errorMessage, req, res, next);
};

export default errorHandler;
