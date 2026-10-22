import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Node met tous les noms de headers en minuscules
  const header = req.headers.authorization;

  // On lit d'abord le cookie httpOnly, sinon le header Bearer (ex: Postman)
  const token: string | undefined =
    req.cookies?.access_token ??
    (header?.startsWith("Bearer ")
      ? header.slice("Bearer ".length).trim()
      : undefined);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required",
    });
  }

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
