import { z } from "zod"

export const EditUserSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(55, "Username must be at most 55 characters")
		.optional()
		.nullable()
})

export type EditUserData = z.infer<typeof EditUserSchema>
