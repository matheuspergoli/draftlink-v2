import { useRouter } from "@tanstack/react-router"

import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { EditLinkData } from "../schemas/edit-link-schema"

export const useEditLink = () => {
	const utils = api.useUtils()
	const router = useRouter()
	const { mutateAsync, isPending } = api.link.editLink.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.link.invalidate()
			router.invalidate()

			toast.success("Link edited!")
		}
	})

	const onSubmit = async (data: EditLinkData & { linkId: string }) => {
		await mutateAsync(data)
	}

	return {
		onSubmit,
		isPending
	}
}
