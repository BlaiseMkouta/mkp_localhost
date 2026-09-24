import dotenv from "dotenv";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

dotenv.config();

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing evironment key ${key}`);
  }
  return value;
};

export interface TokenPayload extends JwtPayload {
  sub: string;
}

// signer un token
const signToken = (secret: string, userId: string, expireIn: string) => {
  return jwt.sign({}, secret, {
    subject: userId,
    expiresIn: expireIn as SignOptions["expiresIn"],
  });
};

// Verifier un token
const VerifyToken = (token: string, secret: string) => {
  const payload = jwt.verify(token, secret);

  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Invalid token");
  }

  return payload as TokenPayload;
};

export const signAccessToken = (userId: string) => {
  signToken(getEnv("ACCESS_TOKEN_JWT_KEY"), userId, "15m");
};

export const signRefreshToken = (userId: string) => {
  signToken(getEnv("REFRESH_TOKEN_JWT_KEY"), userId, "7d");
};
