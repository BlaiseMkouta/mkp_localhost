import z from "zod";

export const CreateProdcutSchema = z.object({
  name: z.string().min(1).max(100),
  short_decription: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  promo_price: z.number().min(1),
  price: z.number().min(1),
  quantity: z.number().min(1),
  min_quantity: z.number(),
});
