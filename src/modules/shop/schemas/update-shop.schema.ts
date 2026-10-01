import z from "zod";

export const updateShopSchema = z.object({
  name: z.string().min(1, "name is required").max(24).optional(),
  description: z.string().min(12).max(254).optional(),
});
