import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { OnboardingData } from "../schemas/onboarding-schema"

export const useOnboarding = () => {
	const utils = api.useUtils()
	const { mutateAsync, isPending } = api.siteSettings.createSiteSettings.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.siteSettings.invalidate()
			utils.user.invalidate()

			toast.success("Onboarding completed!")
		}
	})

	const onSubmit = async (data: OnboardingData) => {
		await mutateAsync(data)
	}

	return {
		onSubmit,
		isPending
	}
}
