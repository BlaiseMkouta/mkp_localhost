import { NextFunction, Request, Response } from "express";
import { existingUser } from "../../../../utils/existingUser.util";
import prisma from "../../../../config/prisma";
import { verifyOwnership } from "../../../../utils/ownership/ownership";
import { ProductStatus } from "../../../../generated/prisma/enums";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId as string;

  const {
    name,
    short_decription,
    description,
    promo_price,
    price,
    quantity,
    min_quantity,
  } = req.body;

  if (promo_price <= price) {
    return res.status(400).json({
      sucess: false,
      message: "promo price shoud not be less than price",
    });
  }

  if (quantity <= min_quantity) {
    return res.status(400).json({
      sucess: false,
      message: "quantity shoud not be less than min quantity",
    });
  }

  const user = existingUser(userId);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  // recupere sa boutique
  const shop = await prisma.shop.findFirst({
    where: { owner: userId },
  });

  if (!shop)
    return res.status(403).json({
      success: false,
      message: "User need to own a shop",
    });

  try {
    const product = await prisma.product.create({
      data: {
        name,
        short_decription,
        description,
        min_quantity,
        quantity,
        promo_price,
        price,
        shopId: shop.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const publishProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId as string;
  const productId = req.params.id as string;

  const [user, product] = await Promise.all([
    prisma.user.findFirst({ where: { id: userId } }),
    prisma.product.findFirst({ where: { id: productId } }),
  ]);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  if (!product)
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });

  // Verifier le ownership
  const ownership = verifyOwnership(userId, product.shopId);

  if (!ownership)
    return res.status(403).json({
      success: false,
      message: "Unauthorize operation",
    });

  if (product.status !== ProductStatus.UNPUBLISHED)
    return res.status(400).json({
      success: false,
      message: "Status must be unpublished",
    });

  await prisma.product.update({
    where: { id: productId },
    data: { status: ProductStatus.PUBLISHED },
  });

  return res.status(200).json({
    success: true,
    message: "Product published successfully",
  });
};

