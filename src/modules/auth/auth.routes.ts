import { Router } from "express";
import { login, refreshToken, register } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "./schemas/register.schema";
import { loginSchema } from "./schemas/login.schema";

const authRoutes = Router();

authRoutes.post("/auth/register", validate(registerSchema), register);
authRoutes.post("/auth/login", validate(loginSchema), login);
authRoutes.patch("/auth/refresh-token/:id", refreshToken);

export default authRoutes;
