import { Link as LinkIcon, LoaderCircle } from "lucide-react"

import { api } from "@/libs/trpc"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Progress } from "@/shared/ui/progress"

export const DashboardStats = () => {
	const { data: linksCount, isPending: isPendingLinksCount } =
		api.link.countLinks.useQuery()

	const { data: trackableLinksCount, isPending: isPendingTrackableLinksCount } =
		api.trackableLink.countLinks.useQuery()

	return (
		<section className="grid grid-cols-1 gap-5 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between text-lg">
						Total links
						<LinkIcon />
					</CardTitle>
				</CardHeader>
				<CardContent className="text-xl">
					{isPendingLinksCount ? (
						<LoaderCircle className="animate-spin" />
					) : (
						<>
							<div className="text-2xl font-bold">{linksCount}</div>
							<Progress
								value={((linksCount ?? 0) / 10) * 100}
								max={10}
								className="mt-2"
							/>
							<p className="mt-2 text-sm text-muted-foreground">
								{linksCount} / {10} links used
							</p>
						</>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between text-lg">
						Total clicks
						<LinkIcon />
					</CardTitle>
				</CardHeader>
				<CardContent className="text-xl">
					{isPendingTrackableLinksCount ? (
						<LoaderCircle className="animate-spin" />
					) : (
						<>
							<div className="text-2xl font-bold">{trackableLinksCount}</div>
							<p className="mt-2 text-sm text-muted-foreground">Across all links</p>
						</>
					)}
				</CardContent>
			</Card>
		</section>
	)
}
