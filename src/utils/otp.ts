import dotenv from "dotenv";
import { generate, generateSecret, verify } from "otplib";
dotenv.config();

const OtpPeriod = process.env.OTP_PERIOD ?? 600;
console.log("otp period", OtpPeriod);

export const generateOpt = (secret: string): Promise<string> => {
  return generate({ secret, period: 600 });
};

