import path from "node:path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";
import { AppError } from "../../utils/errors.util";

export const UPLOADS_DIR = path.resolve("uploads"); // Cree le dossier uploads a la racine du projet
const AVATAR_DIR = path.join(UPLOADS_DIR, "avatar"); // uploads/avatar

const ALLOWED_MIME_TYPE: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const AVATAR_MAX_SIZE = 1024 * 1024 * 5; // 5 Mo

// creer les dossier
fs.mkdirSync(AVATAR_DIR, { recursive: true });

export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: AVATAR_DIR,
    // Renomme le fichier car on ne doit jamais faire confiance a son nom
    filename: (req, file, cb) => {
      cb(null, `${crypto.randomUUID()}${ALLOWED_MIME_TYPE[file.mimetype]}`);
    },
  }),
  limits: { fileSize: AVATAR_MAX_SIZE, fields: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPE[file.mimetype]) {
      return cb(
        new AppError("Allowed types are image/webp, image/png, image/jpeg", 400),
      );
    }

    cb(null, true);
  },
});

export const toPublicPath = (filePath: string) => {
  return `/uploads/${path.relative(UPLOADS_DIR, filePath).split(path.sep).join("/")}`;
};
