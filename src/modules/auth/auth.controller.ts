import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";
import { generateSecret } from "otplib";
import { generateOpt } from "../../utils/otp";
import { otpMethod } from "../../generated/prisma/enums";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { id } from "zod/v4/locales";
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
    const hashedPassword = await bcrypt.hash(password, saltround);

    //TODO: generer l'opt avec otpLib
    const secret = generateSecret();

    const otp = await generateOpt(secret);
    const hashedOtp = await bcrypt.hash(otp, saltround);
    const otpExpiredAt = String(new Date().getTime() + 600);

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        otpSecret: hashedOtp,
        otpMethod: otpMethod.VERIFY_EMAIL,
        otpExpiredAt: otpExpiredAt,
      },
    });

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  // Verifions le mail en base de donnee
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Verifier le mot de passe
  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = signAccessToken(existingUser.id);
  const resfreshToken = signRefreshToken(existingUser.id);

  // hachage du refresh token
  const hashRefresh = await bcrypt.hash(refreshToken, 10);

  // stocker le refresh en bd
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { refreshToken: hashRefresh },
  });

  return res.status(200).json({
    success: true,
    message: "login successfull",
    datas: {
      access_token: accessToken,
      refresh_token: resfreshToken,
      user: {
        id: existingUser.id,
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        profile_picture: existingUser.profile_picture,
      },
    },
  });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params;
  const refreshToken = req.body;

  // Verifie l'utilisateur
  const user = await prisma.user.findFirst({
    where: { id },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  // On compare le refresh token dans le corps de la requete avec celui stocker en BD
  const result = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!result) {
    return res.status(401).json({
      success: false,
      messge: "Invalid refresh token",
    });
  }

  const newAcessToken = signAccessToken(user.id);
  const newRefreshToken = signRefreshToken(user.id);

  // Stocker le nouveau refrsh token en BD
  // Hash du refresh token
  const hashrefresh = await bcrypt.hash(newRefreshToken, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashrefresh,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Token was successfully refresh",
    dats: {
      access_token: newAcessToken,
      refreshToken: newRefreshToken,
    },
  });
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
