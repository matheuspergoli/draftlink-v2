import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import { authRouter } from "./routers/auth"
import { linkRouter } from "./routers/link"
import { siteSettingsRouter } from "./routers/site-settings"
import { trackableLinkRouter } from "./routers/trackable-link"
import { userRouter } from "./routers/user"
import { createCallerFactory, createTRPCContext, createTRPCRouter } from "./trpc"

const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	link: linkRouter,
	siteSettings: siteSettingsRouter,
	trackableLink: trackableLinkRouter
})

const createCaller = createCallerFactory(appRouter)

export { createTRPCContext, createCaller, appRouter }

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
