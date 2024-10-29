import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration
} from "@tanstack/react-router"

import { createTRPCQueryUtils } from "@trpc/react-query"

import { api, queryClient } from "@/libs/trpc"
import type { AppRouter } from "@/server/root"
import { Toaster } from "@/shared/ui/sonner"

export const Route = createRootRouteWithContext<{
	api: typeof api
	queryClient: typeof queryClient
	trpcQueryUtils: ReturnType<typeof createTRPCQueryUtils<AppRouter>>
}>()({
	component: Root
})

function Root() {
	return (
		<>
			<ScrollRestoration />
			<Outlet />
			<Toaster />
		</>
	)
}
