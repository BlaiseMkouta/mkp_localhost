import { NextFunction, Request, Response } from "express";
import prisma from "../../../../config/prisma";
import { ProductStatus } from "../../../../generated/prisma/enums";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED },
  });

  return res.status(200).json({
    success: true,
    message: "products retrieved successfully",
    data: products,
  });
};
