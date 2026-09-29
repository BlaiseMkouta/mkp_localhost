import { Router } from "express";
import { login, refreshToken, register } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "./schemas/register.schema";
import { loginSchema } from "./schemas/login.schema";
import { refreshTokenSchema } from "./schemas/refresh-token.schema";

const authRoutes = Router();

authRoutes.post("/auth/register", validate(registerSchema), register);
authRoutes.post("/auth/login", validate(loginSchema), login);
authRoutes.post("/auth/refresh-token", validate(refreshTokenSchema), refreshToken);

export default authRoutes;
