import { NextFunction, Request, Response } from "express";
import prisma from "../../../../config/prisma";
import { ProductStatus } from "../../../../generated/prisma/enums";
import { Prisma } from "../../../../generated/prisma/client";
import { ProductQuerySchema } from "../../schemas/produt-query.schema";
import { parse } from "node:path";
import { error } from "node:console";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsedData = ProductQuerySchema.safeParse(req.query);

  console.log("la query", req.query);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "invalid datas",
      error: parsedData.error.issues,
    });
  }

  console.log("parsed datas", parsedData);

  // const {  limit, search, shopId } = parsedData.data;
  const page = Number(parsedData.data?.page);
  const limit = Number(parsedData.data?.limit);
  const search = parsedData.data?.search;
  const shopId = parsedData.data?.shopId;

  (console.log("page", page), console.log("limit", limit));

  if (!page || !limit) {
    throw new Error("Page and limit are required");
  }

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
    ...(shopId && { shopId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { short_decription: { contains: search, mode: "insensitive" } },
      ],
    }),
  };
  console.log("where de la requet", where);

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      short_decription: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  console.log("liste des produits", products);

  return res.status(200).json({
    success: true,
    message: "products retrieved successfully",
    data: products,
  });
};
