import z from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  last_name: z.string().min(1, "last name is required"),
  email: z.string().email(),
  phone_number: z.string().min(6),
  password: z.string().min(8),
});
