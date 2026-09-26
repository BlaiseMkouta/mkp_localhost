import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors.util";
import prisma from "../../config/prisma";
import { toPublicPath } from "../../config/multer/multer.config";

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params;
  const file = req.file;

  if (!file) {
    return next(new AppError("file is required", 400));
  }
  const user = await prisma.user.findFirst({
    where: { id },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // recupere le chemin du fichier
  const newAvatar = toPublicPath(file.path);
};
