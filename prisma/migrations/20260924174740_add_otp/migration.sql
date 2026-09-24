-- CreateEnum
CREATE TYPE "otpMethod" AS ENUM ('LOGIN', 'RESET_PASSWORD', 'VERIFY_EMAIL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpExpiredAt" TIMESTAMP(3),
ADD COLUMN     "otpMethod" "otpMethod",
ADD COLUMN     "otpSecret" TEXT;
