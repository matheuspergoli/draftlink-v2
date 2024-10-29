import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"

import { useOnboarding } from "../hooks/use-onboarding"
import { OnboardingSchema, type OnboardingData } from "../schemas/onboarding-schema"

export const OnboardingForm = ({
	hasCompletedOnboarding
}: {
	hasCompletedOnboarding: boolean
}) => {
	const { isPending, onSubmit } = useOnboarding()
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<OnboardingData>({
		resolver: zodResolver(OnboardingSchema)
	})

	return (
		<Dialog open={hasCompletedOnboarding}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Setup your Draftlink name</DialogTitle>
					<DialogDescription>You can change this later</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">
					<div>
						<Label htmlFor={register("name").name}>Name</Label>
						<Input placeholder="Ex.: MyLinks" {...register("name")} />
						{errors.name && (
							<span className="text-sm text-red-500">{errors.name.message}</span>
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
						isLoading={isPending}>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
