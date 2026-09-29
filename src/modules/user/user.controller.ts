import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors.util";
import prisma from "../../config/prisma";
import { toPublicPath } from "../../config/multer/multer.config";

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // id de l'utilisateur connecte, fourni par le middleware authenticate
  const id = req.userId;
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

  await prisma.user.update({
    where: { id: user.id },
    data: { profile_picture: newAvatar },
  });

  return res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    data: { profile_picture: newAvatar },
  });
};
