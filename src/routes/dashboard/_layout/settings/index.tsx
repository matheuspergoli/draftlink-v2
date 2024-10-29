import { createFileRoute, redirect } from "@tanstack/react-router"

import { EditSiteSettingsForm } from "@/features/site/components/edit-site-settings-form"
import { EditUserForm } from "@/features/user/components/edit-user-form"
import { Card, CardContent, CardHeader } from "@/shared/ui/card"

export const Route = createFileRoute("/dashboard/_layout/settings/")({
	component: Settings,
	beforeLoad: async ({ context }) => {
		const user = await context.trpcQueryUtils.user.getCurrentUser.ensureData()

		if (!user?.hasCompletedOnboarding) {
			throw redirect({
				to: "/dashboard"
			})
		}

		await context.trpcQueryUtils.siteSettings.getSiteSettings.ensureData()
	}
})

function Settings() {
	return (
		<div className="space-y-5">
			<Card>
				<CardHeader>Account Information</CardHeader>
				<CardContent>
					<EditUserForm />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>Site Settings Information</CardHeader>
				<CardContent>
					<EditSiteSettingsForm />
				</CardContent>
			</Card>
		</div>
	)
}
