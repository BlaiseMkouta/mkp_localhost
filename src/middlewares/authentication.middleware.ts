import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Node met tous les noms de headers en minuscules
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required",
    });
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const { sub } = verifyAccessToken(token);
    req.userId = sub;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  next();
};
