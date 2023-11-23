import { z } from 'zod';

export const addUserValidator = z.object({
  email: z.string().email({ message: 'Невалидный формат email' })
})