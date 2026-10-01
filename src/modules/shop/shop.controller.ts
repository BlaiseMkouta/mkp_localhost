import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/errors.util";
import { success } from "zod";

export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description } = req.body;
  const OwnerId = req.userId;

  if (!OwnerId) {
    return res.status(400).json({
      success: false,
      message: "owner id is required",
    });
  }

  // Verifie l'existance du user
  const user = await prisma.user.findFirst({
    where: { id: OwnerId },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  if (!user.isVerified) {
    console.log("user.verified");

    return res.status(400).json({
      success: false,
      message: "user is not verified",
    });
  }

  // Verifie l'unicite du nom de la boutique
  const existingShop = await prisma.shop.findFirst({
    where: { name },
  });

  if (existingShop) {
    return res.status(409).json({
      success: false,
      message: "Shop with this name already exist",
    });
  }

  try {
    const shop = await prisma.shop.create({
      data: { name, description, owner: OwnerId },
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ownerId = req.userId;

  if (!ownerId) {
    return res.status(400).json({
      success: false,
      message: "Owner id is required",
    });
  }

  const shop = await prisma.shop.findUnique({
    where: { owner: ownerId },
  });
  console.log("shop", shop);

  if (!shop) {
    return res.status(404).json({
      success: false,
      message: "shop not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "shop retrieved successfully",
    data: shop,
  });
};

export const updateShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description } = req.body;
  const userId = req.userId;
  const shopId = req.params.id as string;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "owner id is required",
    });
  }

  const existingShop = await prisma.shop.findFirst({
    where: { id: shopId },
  });

  if (!existingShop) {
    return res.status(404).json({
      success: false,
      message: "Shop not found",
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (existingShop.owner !== userId) {
    return res.status(403).json({
      success: false,
      message: "User is not the Owner",
    });
  }

  try {
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: { name, description },
    });

    return res.status(200).json({
      success: true,
      message: "Shop udated successfully",
      data: updatedShop,
    });
  } catch (error) {
    next(error);
  }
};
