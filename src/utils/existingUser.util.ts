import prisma from "../config/prisma";
import { User } from "../generated/prisma/client";

export const existingUser = async (userId: string): Promise<User | null> => {
  const user = prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) return null;

  return user;
};
