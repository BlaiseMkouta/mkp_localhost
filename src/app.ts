import express, { Application } from "express";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate } from "./middlewares/authentication.middleware";

const app: Application = express();

app.use(express.json());

// Routing
app.use(authRoutes);

// le middleware auth se place au dessus des routes
app.use(authenticate)

// app.use(shopRoutes)

export default app;
