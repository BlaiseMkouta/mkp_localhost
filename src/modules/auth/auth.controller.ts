import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import { success } from "zod";
const bcrypt = require("bcrypt");

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const saltround = 10;

    const { first_name, last_name, email, phone_number, password } =
      req.body as any;

    // Verification des contraintes d'unicite
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });

    const existingPhone = await prisma.user.findFirst({
      where: { phone_number },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exist",
      });
    }

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exist",
      });
    }

    //hachage du mot de passe
    const hashedPassword = bcrypt.hash(password, saltround);

    //TODO: generer l'opt avec otpLib

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
