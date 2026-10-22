import { Router } from "express";
import {
  createProduct,
  publishProduct,
} from "./controllers/owner/owner-product.controller";
import { authenticate } from "../../middlewares/authentication.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { CreateProdcutSchema } from "./schemas/create-product.schema";
import { getProducts } from "./controllers/client/productClient.controller";

const productRoute = Router();

productRoute.post(
  "/product",
  validate(CreateProdcutSchema),
  authenticate,
  createProduct,
);
productRoute.patch("/product/:id/publish", authenticate, publishProduct);
productRoute.get("/product", getProducts);

export default productRoute;
