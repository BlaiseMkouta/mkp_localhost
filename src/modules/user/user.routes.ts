import { Router } from "express";
import { uploadAvatar } from "../../config/multer/multer.config";
import { authenticate } from "../../middlewares/authentication.middleware";
import { updateAvatar } from "./user.controller";

const userRoute = Router();

userRoute.patch(
  "/user/profile-picture",
  authenticate,
  uploadAvatar.single("profilePicture"),
  updateAvatar,
);

export default userRoute;
