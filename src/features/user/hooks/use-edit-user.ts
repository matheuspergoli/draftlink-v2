import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { EditUserData } from "../schemas/edit-user-schema"

export const useEditUser = () => {
	const utils = api.useUtils()
	const { mutateAsync, isPending } = api.user.editUser.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.user.invalidate()

			toast.success("User updated")
		}
	})

	const onSubmit = async (data: EditUserData) => {
		await mutateAsync(data)
	}

	return {
		onSubmit,
		isPending
	}
}
