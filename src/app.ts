import express, { Application } from "express";
import authRoutes from "./modules/auth/auth.routes";

const app: Application = express();

app.use(express.json());

// Routing
app.use(authRoutes);

export default app;
