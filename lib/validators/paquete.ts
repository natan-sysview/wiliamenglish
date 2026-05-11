import { z } from "zod";

export const PaqueteSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  clasesPersonales: z.coerce.number().min(0, "No puede ser negativo"),
  clasesGrupalListening: z.coerce.number().min(0, "No puede ser negativo"),
  clasesGrupalPracticing: z.coerce.number().min(0, "No puede ser negativo"),
});

export type PaqueteFormValues = z.infer<typeof PaqueteSchema>;
