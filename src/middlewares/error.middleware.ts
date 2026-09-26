import { NextFunction, Request, Response } from "express";
import { ErrorApi } from "../types";


export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `la route ${req.originalUrl} est introuvable`,
  });
};

export const errorHandler = (
  err: ErrorApi,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[ERROR", err.message);

  const status = err.status ?? 500;

  res.status(status).json({
    success: false,
    message: err.message,
  });
};