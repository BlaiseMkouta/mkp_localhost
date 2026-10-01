import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { createShopSchema } from "./schemas/create-shop.schema";
import { createShop, getMyShop, updateShop } from "./shop.controller";
import { updateShopSchema } from "./schemas/update-shop.schema";

const shopRoute = Router();

shopRoute.post("/shop", validate(createShopSchema), createShop);
shopRoute.get("/shop", getMyShop);
shopRoute.patch('/shop/:id',validate(updateShopSchema), updateShop)

export default shopRoute;
