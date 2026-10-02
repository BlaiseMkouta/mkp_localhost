import { NextFunction, Request, Response } from "express";
import { verifyOwnership } from "../../../utils/ownership/ownership";
import prisma from "../../../config/prisma";
import { toPublicPath } from "../../../config/multer/multer.config";

export const uploadShopCover = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.userId as string;
  const file = req.file;
  const shopId = req.params.id as string;

  console.log('request', req.body)

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "file is required",
    });
  }

  // Verifier l'existance de la boutique et du user
  //   const user = await prisma.user.findFirst({ where: { id } });
  //   const shop = await prisma.shop.findFirst({ where: { id: shopId } });
  const [shop, user] = await Promise.all([
    prisma.shop.findFirst({ where: { id: shopId } }),
    prisma.user.findFirst({ where: { id } }),
  ]);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  if (!shop) {
    return res.status(404).json({
      success: false,
      message: "shop is not found",
    });
  }

  const ownership = verifyOwnership(id, shopId);

  if (!ownership) {
    return res.status(403).json({
      success: false,
      message: "user is not the owner",
    });
  }

  const newCover = toPublicPath(file.path);

  try {
    await prisma.shop.update({
      where: { id: shopId },
      data: { cover_picture: newCover },
    });

    return res.status(200).json({
      success: true,
      message: "Cover picture uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};
