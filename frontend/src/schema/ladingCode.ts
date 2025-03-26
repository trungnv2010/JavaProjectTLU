import { z } from 'zod'

export const ladingCodeSFilterSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  orderBy: z.string().optional()
})

export type TLadingCodeFilterSchema = z.infer<typeof ladingCodeSFilterSchema>
