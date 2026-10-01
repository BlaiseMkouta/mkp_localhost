import "dotenv/config";
import crypto from "crypto";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";


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
    jwtid: crypto.randomUUID(), // rend chaque token unique (rotation du refresh token)
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
  return signToken(getEnv("ACCESS_TOKEN_JWT_KEY"), userId, "1d");
};

export const signRefreshToken = (userId: string) => {
  return signToken(getEnv("REFRESH_TOKEN_JWT_KEY"), userId, "7d");
};

export const verifyAccessToken = (token: string) => {
  return VerifyToken(token, getEnv("ACCESS_TOKEN_JWT_KEY"));
};

export const verifyRefreshToken = (token: string) => {
  return VerifyToken(token, getEnv("REFRESH_TOKEN_JWT_KEY"));
};

// bcrypt ne prend en compte que les 72 premiers octets : un JWT est plus long,
// on utilise donc un hash SHA-256 pour stocker le refresh token
export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
