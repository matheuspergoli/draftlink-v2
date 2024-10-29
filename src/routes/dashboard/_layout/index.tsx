import { createFileRoute } from "@tanstack/react-router"

import { Plus } from "lucide-react"

import { DashboardStats } from "@/features/dashboard/components/dashboard-stats"
import { CreateLinkForm } from "@/features/link/components/create-link-form"
import { linkColumns } from "@/features/link/tables/link-columns"
import { LinkDataTable } from "@/features/link/tables/link-data-table"
import { api } from "@/libs/trpc"
import { Button } from "@/shared/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/shared/ui/dialog"

export const Route = createFileRoute("/dashboard/_layout/")({
	component: Dashboard,
	beforeLoad: async ({ context }) => {
		await context.trpcQueryUtils.link.getLinks.ensureData()
	}
})

function Dashboard() {
	const { data: links } = api.link.getLinks.useQuery()

	return (
		<main className="space-y-5">
			<Dialog>
				<DialogTrigger asChild>
					<Button>
						<Plus />
						Create new link
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create your new link</DialogTitle>
						<DialogDescription>
							You can create a new link by entering the URL and the name of the link.
						</DialogDescription>
					</DialogHeader>

					<CreateLinkForm />
				</DialogContent>
			</Dialog>

			<DashboardStats />

			{links && links.length > 0 && <LinkDataTable columns={linkColumns} data={links} />}
		</main>
	)
}
