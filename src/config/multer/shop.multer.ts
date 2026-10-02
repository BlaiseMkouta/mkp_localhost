import path from "node:path";
import { ALLOWED_MIME_TYPE, UPLOADS_DIR } from "./multer.config";
import fs from "fs";
import multer from "multer";

const COVER_DIR = path.join(UPLOADS_DIR, "shop/cover");
const PROFILE_DIR = path.join(UPLOADS_DIR, "shop/profile");
const PRODUCT_DIR = path.join(UPLOADS_DIR, "shop/product/images");
const THUMBNAIL_DIR = path.join(UPLOADS_DIR, "shop/thumbnails");

// LIMITE les tailles de fichiers
const PROFILE_MAX_SIZE = 1024 * 1024 * 2;
const COVER_MAX_SIZE = 1024 * 1024 * 5; // 5Mo
const THUMBNAIL_MAX_SIZE = 1024 * 1024 * 2; // 2 Mo
const PRODUCT_MAX_SIZE = 1024 * 1024 * 5;

// Creer les dossiers
fs.mkdirSync(COVER_DIR, { recursive: true });
fs.mkdirSync(PROFILE_DIR, { recursive: true });
fs.mkdirSync(PRODUCT_DIR, { recursive: true });
fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });

export const uploadCover = multer({
  storage: multer.diskStorage({
    destination: COVER_DIR,
    filename: (req, file, cb) => {
      cb(
        null,
        `cover-${crypto.randomUUID()}${ALLOWED_MIME_TYPE[file.mimetype]}`,
      );
    },
  }),
  limits: { fileSize: COVER_MAX_SIZE, fields: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPE[file.mimetype]) {
     cb(new Error('Allowd Types is jpg, png webp'));
    }

    cb(null, true);
  },
});



