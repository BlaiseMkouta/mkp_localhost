import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { createShopSchema } from "./schemas/create-shop.schema";
import { createShop, getMyShop, updateShop } from "./shop.controller";
import { updateShopSchema } from "./schemas/update-shop.schema";
import { uploadShopCover } from "./filesUploads/fileUpload.controller";
import { uploadCover } from "../../config/multer/shop.multer";

const shopRoute = Router();

shopRoute.post("/shop", validate(createShopSchema), createShop);
shopRoute.get("/shop", getMyShop);
shopRoute.patch("/shop/:id", validate(updateShopSchema), updateShop);
shopRoute.patch(
  "/shop/:id/upload-cover",
  uploadCover.single("cover"),
  uploadShopCover,
);

export default shopRoute;
