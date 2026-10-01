import z from "zod";

export const createShopSchema = z.object({
  name: z.string().min(1, "name is required").max(24),
  description: z.string().min(12).max(254),
});
