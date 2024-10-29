import { useNavigate } from "@tanstack/react-router"

import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { LoginData } from "../schemas/login-schema"

export const useLogin = () => {
	const utils = api.useUtils()
	const navigate = useNavigate()
	const { mutateAsync: login, isPending } = api.auth.login.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.user.invalidate()

			navigate({ to: "/dashboard" })

			toast.success("Logged in successfully")
		}
	})

	const onSubmit = async (data: LoginData) => {
		await login(data)
	}

	return {
		onSubmit,
		isPending
	}
}
