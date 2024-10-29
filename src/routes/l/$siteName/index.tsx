import { createFileRoute, notFound } from "@tanstack/react-router"

import { api } from "@/libs/trpc"
import { run } from "@/libs/utils"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/shared/ui/alert-dialog"
import { Button } from "@/shared/ui/button"

export const Route = createFileRoute("/l/$siteName/")({
	component: Site,
	beforeLoad: async ({ context: ctx, params }) => {
		try {
			await ctx.trpcQueryUtils.siteSettings.getSiteSettingsByName.ensureData({
				name: params.siteName
			})
		} catch (_e) {
			throw notFound()
		}
	}
})

function Site() {
	const route = Route.useParams()
	const utils = api.useUtils()
	const { data } = api.siteSettings.getSiteSettingsByName.useQuery({
		name: route.siteName
	})

	const { mutate } = api.trackableLink.createTrackableLink.useMutation({
		onSuccess: () => {
			utils.siteSettings.invalidate()
			utils.trackableLink.invalidate()
		}
	})

	return (
		<main className="container mx-auto">
			<h1 className="my-10 text-center text-xl font-bold">@{data?.site?.displayName}</h1>
			<div
				className="prose prose-sm dark:prose-invert sm:prose mx-auto mb-5 w-fit rounded-md"
				dangerouslySetInnerHTML={{ __html: data?.site?.description ?? "" }}
			/>

			<section className="mx-auto flex w-full max-w-md flex-col gap-5">
				{data?.links.map((link) =>
					run(() => {
						if (!link?.visibility) return null

						if (link.nsfw) {
							return (
								<AlertDialog key={link.id}>
									<AlertDialogTrigger asChild>
										<Button className="h-10 text-lg font-medium transition hover:scale-110">
											{link?.name}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>This link is marked as NSFW.</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to visit this link?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction asChild>
												<a
													href={link?.url}
													target="_blank"
													onClick={() =>
														mutate({ linkId: link.id, siteName: route.siteName })
													}>
													Go to {link?.name}
												</a>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)
						}

						return (
							<Button
								key={link?.id}
								size="lg"
								className="h-10 text-lg font-medium transition hover:scale-110"
								asChild>
								<a
									href={link?.url}
									target="_blank"
									onClick={() => mutate({ linkId: link.id, siteName: route.siteName })}>
									{link?.name}
								</a>
							</Button>
						)
					})
				)}
			</section>
		</main>
	)
}
