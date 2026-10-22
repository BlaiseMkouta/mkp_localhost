import express, { Application } from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import userRoute from "./modules/user/user.routes";
import shopRoute from "./modules/shop/shop.routes";
import { authenticate } from "./middlewares/authentication.middleware";
import { UPLOADS_DIR } from "./config/multer/multer.config";
import productRoute from "./modules/product/product.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true, // Permettre de de lire les cookies
  }),
);
app.use(cookieParser());
// Sert les fichiers uploades (ex: /uploads/avatar/xxx.png)
app.use("/uploads", express.static(UPLOADS_DIR));


// Routing
app.use(authRoutes);
app.use(productRoute);
// le middleware authenticate est place directement sur les routes protegees
app.use(authenticate);
app.use(userRoute);
app.use(shopRoute);

// app.use(shopRoutes)
app.use(notFound);
app.use(errorHandler);

export default app;
