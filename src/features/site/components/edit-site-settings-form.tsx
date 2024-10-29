import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { api } from "@/libs/trpc"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { useEditSiteSettings } from "../hooks/use-edit-site-settings"
import {
	EditSiteSettingsSchema,
	type EditSiteSettingsData
} from "../schemas/edit-site-settings-schema"
import { DescriptionEditor } from "./description-editor"

export const EditSiteSettingsForm = () => {
	const { data } = api.siteSettings.getSiteSettings.useQuery()
	const { isPending, onSubmit } = useEditSiteSettings()

	const {
		control,
		handleSubmit,
		register,
		formState: { errors }
	} = useForm<EditSiteSettingsData>({
		resolver: zodResolver(EditSiteSettingsSchema),
		defaultValues: {
			name: data?.displayName,
			title: data?.title,
			description: data?.description
		}
	})

	return (
		<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Label htmlFor="name">Name</Label>
				<div className="flex items-center">
					<span className="h-9 rounded-bl rounded-tl bg-secondary px-3 py-1 text-muted-foreground">
						www.draftlink.com/
					</span>
					<Input
						id="name"
						placeholder="My Site"
						className="rounded-none rounded-br rounded-tr"
						{...register("name")}
					/>
				</div>

				{errors.name && (
					<span className="text-sm text-red-500">{errors.name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor="title">Title (Optional)</Label>
				<Input id="title" placeholder="My Site | My Links" {...register("title")} />

				{errors.title && (
					<span className="text-sm text-red-500">{errors.title.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor="description">Description (Optional)</Label>
				<Controller
					name="description"
					control={control}
					render={({ field }) => {
						return <DescriptionEditor {...field} content={data?.description} />
					}}
				/>

				{errors.description && (
					<span className="text-sm text-red-500">{errors.description.message}</span>
				)}
			</div>

			<Button disabled={isPending} isLoading={isPending}>
				{isPending ? "Saving" : "Save"}
			</Button>
		</form>
	)
}
