import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number")

const locationSchema = z
  .object({
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    country: z.string().trim().optional(),
    coordinates: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
      .optional(),
  })
  .optional()

/** Registration body for POST /api/auth/register */
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
  phone: z.string().trim().max(40).optional(),
  location: locationSchema,
})

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Client registration form: same fields as API except `location` (added later in the flow).
 * Empty `phone` is allowed in the form and stripped before submit.
 */
export const registerFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
  phone: z.string().max(40).optional(),
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>

/** Login body for POST /api/auth/login */
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
