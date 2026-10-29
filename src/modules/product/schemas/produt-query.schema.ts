import z from "zod";

export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  shopId: z.uuid().optional(),
  search: z.string().trim().min(1).optional(),
});
