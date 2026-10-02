import path from "node:path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";
import { AppError } from "../../utils/errors.util";
import { ALLOWED_MIME_TYPE, UPLOADS_DIR } from "./multer.config";

const AVATAR_DIR = path.join(UPLOADS_DIR, "avatar"); // uploads/avatar


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


