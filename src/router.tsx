import { createRouter, ErrorComponent } from "@tanstack/react-router"

import { api, queryClient, trpcQueryUtils } from "./libs/trpc"
import { routeTree } from "./routeTree.gen"
import { LoadingProgress } from "./shared/ui/loading-progress"
import { NotFoundPage } from "./shared/ui/not-found-page"

export const router = createRouter({
	routeTree,
	context: { api, queryClient, trpcQueryUtils },
	defaultPendingComponent: () => <LoadingProgress />,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	defaultNotFoundComponent: () => <NotFoundPage />
})
