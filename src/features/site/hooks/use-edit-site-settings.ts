import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { EditSiteSettingsData } from "../schemas/edit-site-settings-schema"

export const useEditSiteSettings = () => {
	const utils = api.useUtils()
	const { mutateAsync, isPending } = api.siteSettings.editSiteSettings.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.siteSettings.invalidate()
			utils.user.invalidate()

			toast.success("Site settings saved")
		}
	})

	const onSubmit = async (data: EditSiteSettingsData) => {
		await mutateAsync(data)
	}

	return {
		onSubmit,
		isPending
	}
}
