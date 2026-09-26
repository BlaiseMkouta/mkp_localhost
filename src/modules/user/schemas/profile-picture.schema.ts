import z from "zod";

export const updateAvatarSchema = z.object({
  id: z.uuidv4(),
});
