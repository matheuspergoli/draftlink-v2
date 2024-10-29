import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useCreateLink } from "../hooks/use-create-link"
import { CreateLinkSchema, type CreateLinkData } from "../schemas/create-link-schema"

export const CreateLinkForm = () => {
	const { isPending, onSubmit } = useCreateLink()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateLinkData>({
		resolver: zodResolver(CreateLinkSchema)
	})

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">
			<div>
				<Label htmlFor={register("name").name}>Name</Label>
				<Input placeholder="Ex.: Twitch" {...register("name")} />
				{errors.name && (
					<span className="text-sm text-red-500">{errors.name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor={register("url").name}>URL</Label>
				<Input {...register("url")} />
				{errors.url && <span className="text-sm text-red-500">{errors.url.message}</span>}
			</div>

			<Button type="submit" className="w-full" disabled={isPending} isLoading={isPending}>
				{isPending ? "Creating link..." : "Create link"}
			</Button>
		</form>
	)
}
