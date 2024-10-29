import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { api } from "@/libs/trpc"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useEditUser } from "../hooks/use-edit-user"
import { EditUserSchema, type EditUserData } from "../schemas/edit-user-schema"

export const EditUserForm = () => {
	const { data: user } = api.user.getCurrentUser.useQuery()

	const { isPending, onSubmit } = useEditUser()
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<EditUserData>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			username: user?.username
		}
	})

	return (
		<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Label htmlFor={register("username").name}>Name</Label>
				<Input {...register("username")} />

				{errors.username && (
					<span className="text-sm text-red-500">{errors.username.message}</span>
				)}
			</div>

			<Button disabled={isPending} isLoading={isPending}>
				{isPending ? "Saving" : "Save"}
			</Button>
		</form>
	)
}
