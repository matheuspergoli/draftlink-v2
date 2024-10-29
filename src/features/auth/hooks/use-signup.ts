import { useNavigate } from "@tanstack/react-router"

import { toast } from "sonner"

import { api } from "@/libs/trpc"

import type { SignUpData } from "../schemas/signup-schema"

export const useSignUp = () => {
	const utils = api.useUtils()
	const navigate = useNavigate()
	const { mutateAsync: signup, isPending } = api.auth.signup.useMutation({
		onError: (error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			utils.user.invalidate()

			navigate({ to: "/dashboard" })

			toast.success("Account created successfully")
		}
	})

	const onSubmit = async (data: SignUpData) => {
		await signup(data)
	}

	return {
		onSubmit,
		isPending
	}
}
