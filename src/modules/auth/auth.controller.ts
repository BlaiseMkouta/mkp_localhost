import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import z from "zod";
import prisma from "../../config/prisma";
import { generateSecret } from "otplib";
import { generateOpt, OTP_PERIOD } from "../../utils/otp";
import { otpMethod } from "../../generated/prisma/enums";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { registerSchema } from "./schemas/register.schema";
import { loginSchema } from "./schemas/login.schema";
import { refreshTokenSchema } from "./schemas/refresh-token.schema";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const saltround = 10;

    // body deja valide par le middleware validate(registerSchema)
    const { first_name, last_name, email, phone_number, password } =
      req.body as z.infer<typeof registerSchema>;

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

    const secret = generateSecret();

    const otp = await generateOpt(secret);
    const hashedOtp = await bcrypt.hash(otp, saltround);
    // getTime() est en millisecondes, OTP_PERIOD en secondes
    const otpExpiredAt = String(new Date().getTime() + OTP_PERIOD * 1000);

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
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  // Verifions le mail en base de donnee
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (!existingUser.isVerified) {

    return res.status(400).json({
      success: false,
      message: "user is not verified",
    });
  }

  // Verifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = signAccessToken(existingUser.id);
  const newRefreshToken = signRefreshToken(existingUser.id);

  // stocker le hash du refresh token en bd
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { refreshToken: hashToken(newRefreshToken) },
  });

  return res.status(200).json({
    success: true,
    message: "login successfull",
    data: {
      access_token: accessToken,
      refresh_token: newRefreshToken,
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
  const { refreshToken } = req.body as z.infer<typeof refreshTokenSchema>;

  // Verifie la signature et l'expiration du refresh token, puis recupere l'id
  let userId: string;
  try {
    userId = verifyRefreshToken(refreshToken).sub;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  // Verifie l'utilisateur
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  // On compare le refresh token du corps de la requete avec celui stocke en BD
  if (!user || user.refreshToken !== hashToken(refreshToken)) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  const newAccessToken = signAccessToken(user.id);
  const newRefreshToken = signRefreshToken(user.id);

  // Stocker le hash du nouveau refresh token en BD
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashToken(newRefreshToken),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Token was successfully refresh",
    data: {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    },
  });
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
