import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { OnboardingForm } from "@/features/onboarding/components/onboarding-form"
import { api } from "@/libs/trpc"
import { AppSidebar } from "@/shared/app-sidebar"
import { AutoBreadcrumb } from "@/shared/ui/auto-breadcrumb"
import { Separator } from "@/shared/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/shared/ui/sidebar"

export const Route = createFileRoute("/dashboard/_layout")({
	component: DashboardLayout,
	beforeLoad: async ({ context }) => {
		const user = await context.trpcQueryUtils.user.getCurrentUser.fetch()

		if (!user?.id) {
			throw redirect({
				to: "/signup"
			})
		}

		await context.trpcQueryUtils.user.getCurrentUser.ensureData()
		await context.trpcQueryUtils.user.assertGetCurrentUser.ensureData()
	}
})

function DashboardLayout() {
	const { data: user } = api.user.getCurrentUser.useQuery()

	return (
		<>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<AutoBreadcrumb />
					</div>
				</header>
				<div className="container mx-auto my-10">
					<Outlet />
				</div>
			</SidebarInset>

			{user && !user.hasCompletedOnboarding && (
				<OnboardingForm hasCompletedOnboarding={!user.hasCompletedOnboarding} />
			)}
		</>
	)
}
