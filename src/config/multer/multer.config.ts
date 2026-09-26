import path from "node:path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";
import { file } from "zod";

const UPLOADS_DIR = path.resolve("/uploads"); // Cree le dossier upload a la racine
const AVATAR_DIR = path.join(UPLOADS_DIR, "avatar"); // /upload/avatar

const ALLOWED_MIME_TYPE: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpg": ".jpg",
  "image/png": ".png",
};

const AVATAR_MAX_SIZE = 1024 * 1024 * 5; // 5 Mo

// creer les dossier
fs.mkdirSync(AVATAR_DIR, { recursive: true });

export const uploadAvatart = multer({
  storage: multer.diskStorage({
    destination: AVATAR_DIR,
    // Renomme le fichier car on ne doit jamais faire confiance a son nom
    filename: (req, res, cb) => {
      cb(null, `${crypto.randomBytes}.${req.file?.mimetype}`);
    },
  }),
  limits: { fileSize: AVATAR_MAX_SIZE, fields: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPE[file.mimetype]) {
      cb(null, false);
      throw new Error("Allowed types are image/webp, image/png, image/jpg");
    }

    cb(null, true);
  },
});

export const toPublicPath = (filePath: string) => {
  return `/uploads/ + ${path.relative(UPLOADS_DIR, filePath).split(path.sep).join("/")}`;
};
