import prisma from "../../config/prisma";

export const verifyOwnership = async (
  userId: string,
  shopId: string,
): Promise<boolean> => {
  const shop = await prisma.shop.findFirst({
    where: { id: shopId },
  });

  if (userId !== shop?.owner) {
    return false;
  }

  return true;
};
