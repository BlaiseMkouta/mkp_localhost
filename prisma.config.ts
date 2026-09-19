import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Utilisé par le CLI (migrate, db push, studio…)
    url: env("DATABASE_URL"),
  },
});
