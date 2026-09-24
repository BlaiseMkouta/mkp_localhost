import { Router } from "express";
import { register } from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "./schemas/register.schema";

const authRoutes = Router();

authRoutes.post("/auth", validate(registerSchema), register);

export default authRoutes;
