import { useRouter } from "@tanstack/react-router"

import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { CreateLinkData } from "../schemas/create-link-schema"

export const useCreateLink = () => {
	const utils = api.useUtils()
	const router = useRouter()
	const { mutateAsync, isPending } = api.link.createLink.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.link.invalidate()
			router.invalidate()

			toast.success("Link created!")
		}
	})

	const onSubmit = async (data: CreateLinkData) => {
		await mutateAsync(data)
	}

	return {
		onSubmit,
		isPending
	}
}
