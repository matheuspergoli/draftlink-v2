import { z } from "zod"

export const CreateLinkSchema = z.object({
	url: z.string().url("Invalid URL"),
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters")
})

export type CreateLinkData = z.infer<typeof CreateLinkSchema>
