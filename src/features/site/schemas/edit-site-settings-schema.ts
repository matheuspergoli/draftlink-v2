import { z } from "zod"

export const EditSiteSettingsSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters").max(55),
	title: z.string().max(55, "Title must be at most 55 characters").optional().nullable(),
	description: z
		.string()
		.max(140, "Description must be at most 140 characters")
		.optional()
		.nullable()
})

export type EditSiteSettingsData = z.infer<typeof EditSiteSettingsSchema>
