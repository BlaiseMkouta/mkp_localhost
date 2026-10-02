import path from "path";

export const UPLOADS_DIR = path.resolve("uploads"); // Cree le dossier uploads a la racine du projet


export const ALLOWED_MIME_TYPE: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpg": ".jpg",
  "image/png": ".png",
};


export const toPublicPath = (filePath: string) => {
  return `/uploads/${path.relative(UPLOADS_DIR, filePath).split(path.sep).join("/")}`;
};