import { Router } from "express";
import { uploadAvatar } from "../../config/multer/multer.config";
import { updateAvatar } from "./user.controller";

const userRoute = Router();

userRoute.patch(
  "/user/profile-picture",
  uploadAvatar.single("profilePicture"),
  updateAvatar,
);


export default userRoute