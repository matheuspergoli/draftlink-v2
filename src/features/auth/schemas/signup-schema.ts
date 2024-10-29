import { z } from "zod"

export const SignUpSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(255, "Password must be at most 255 characters")
})

export type SignUpData = z.infer<typeof SignUpSchema>
