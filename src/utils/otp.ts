import "dotenv/config";
import { generate } from "otplib";

// duree de validite de l'OTP en secondes
export const OTP_PERIOD = Number(process.env.OTP_PERIOD ?? 600);

export const generateOpt = (secret: string): Promise<string> => {
  return generate({ secret, period: OTP_PERIOD });
};
