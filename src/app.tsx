import React from "react"
import { RouterProvider } from "@tanstack/react-router"

import { clientEnv } from "./environment/client"
import { ThemeProvider } from "./providers/theme-provider"
import { TRPCProvider } from "./providers/trpc-provider"
import { router } from "./router"
import { SidebarProvider } from "./shared/ui/sidebar"

const InnerApp = () => {
	return <RouterProvider router={router} />
}

const TanStackRouterDevtools = clientEnv.PROD
	? () => null
	: React.lazy(() =>
			import("@tanstack/router-devtools").then((res) => ({
				default: res.TanStackRouterDevtools
			}))
		)

export const App = () => {
	return (
		<TRPCProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider>
					<InnerApp />
					<React.Suspense>
						<TanStackRouterDevtools router={router} position="bottom-right" />
					</React.Suspense>
				</SidebarProvider>
			</ThemeProvider>
		</TRPCProvider>
	)
}
