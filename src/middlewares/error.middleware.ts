import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ErrorApi } from "../types";
import { AppError } from "../utils/errors.util";

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
  console.error("[ERROR]", err);

  let status = err.status ?? 500;
  if (err instanceof AppError) status = err.statusCode;
  // ex: fichier trop gros
  if (err instanceof multer.MulterError) status = 400;

  res.status(status).json({
    success: false,
    // on ne revele pas le detail des erreurs internes en production
    message:
      status === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
