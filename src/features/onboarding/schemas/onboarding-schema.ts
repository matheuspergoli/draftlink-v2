import { z } from "zod"

export const OnboardingSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(55, "Name must be at most 55 characters")
})

export type OnboardingData = z.infer<typeof OnboardingSchema>
