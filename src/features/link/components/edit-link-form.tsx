import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useEditLink } from "../hooks/use-edit-link"
import { EditLinkSchema, type EditLinkData } from "../schemas/edit-link-schema"

type EditLinkFormProps = EditLinkData & {
	linkId: string
}

export const EditLinkForm = (props: EditLinkFormProps) => {
	const { isPending, onSubmit } = useEditLink()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<EditLinkData>({
		resolver: zodResolver(EditLinkSchema),
		defaultValues: {
			url: props.url,
			name: props.name
		}
	})

	return (
		<form
			onSubmit={handleSubmit(async (values) => {
				await onSubmit({ ...values, linkId: props.linkId })
			})}
			className="space-y-3"
			autoComplete="off">
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
				{isPending ? "Saving changes..." : "Save changes"}
			</Button>
		</form>
	)
}
