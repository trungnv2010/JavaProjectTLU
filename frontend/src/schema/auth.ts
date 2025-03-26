import { REGEX } from '@/common/constants'
import z from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email().regex(REGEX.email),
    password: z.string().min(6),
    confirmPassword: z.string()
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  })

export type TRegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email().regex(REGEX.email),
  password: z.string().min(6)
})

export type TLoginSchema = z.infer<typeof loginSchema>
