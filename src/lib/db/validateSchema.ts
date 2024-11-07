import { z } from 'zod'

export const CarrierSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  mcNumber: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Carrier = z.infer<typeof CarrierSchema>
