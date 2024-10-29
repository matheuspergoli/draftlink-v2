import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(255)
})

export type LoginData = z.infer<typeof LoginSchema>
