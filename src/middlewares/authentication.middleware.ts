import { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.Authorization as string;

  if (!header.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Authencation is required",
    });
  }

  const token = header.slice("Bearer".length).trim();

  try {
    const { sub } = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
