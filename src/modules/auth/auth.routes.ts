import { Router } from "express";
import { login, refreshToken, register } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "./schemas/register.schema";
import { loginSchema } from "./schemas/login.schema";

const authRoutes = Router();

authRoutes.post("/auth/register", validate(registerSchema), register);
authRoutes.post("/auth/login", validate(loginSchema), login);
// pas de validate ici: le refresh token peut venir du cookie (voir controller)
authRoutes.post("/auth/refresh-token", refreshToken);

export default authRoutes;
