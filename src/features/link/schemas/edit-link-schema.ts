import { z } from "zod"

export const EditLinkSchema = z.object({
	url: z.string().url("Invalid URL"),
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters")
})

export type EditLinkData = z.infer<typeof EditLinkSchema>
