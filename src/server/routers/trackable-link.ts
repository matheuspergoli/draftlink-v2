import { TRPCError } from "@trpc/server"
import { count, eq } from "drizzle-orm"
import { getRequestIP, toWebRequest } from "vinxi/http"
import { z } from "zod"

import { validateSiteName } from "@/libs/validate-site-name"

import { siteSettingsTable, trackableLinksTable, usersTable } from "../db/schema"
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc"

export const trackableLinkRouter = createTRPCRouter({
	countLinks: authedProcedure.query(async ({ ctx }) => {
		const linksCount = await ctx.db
			.select({ count: count(trackableLinksTable.id) })
			.from(trackableLinksTable)
			.where(eq(trackableLinksTable.userId, ctx.user.id))
			.then((res) => res[0]?.count ?? 0)

		return linksCount
	}),
	createTrackableLink: publicProcedure
		.input(
			z.object({
				linkId: z.string(),
				siteName: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const desiredName = input.siteName.toLowerCase()
			const isValidName = validateSiteName(input.siteName)

			if (!isValidName.isValid) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Not found"
				})
			}

			const siteSettingsExists = await ctx.db
				.select({
					userId: usersTable.id
				})
				.from(siteSettingsTable)
				.innerJoin(usersTable, eq(siteSettingsTable.userId, usersTable.id))
				.where(eq(siteSettingsTable.name, desiredName))
				.then((value) => value[0] ?? null)

			if (!siteSettingsExists) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Not found"
				})
			}

			const clientIP = getRequestIP(ctx.event)
			const request = toWebRequest(ctx.event)

			await ctx.db.insert(trackableLinksTable).values({
				userId: siteSettingsExists.userId,
				linkId: input.linkId,
				ip: clientIP ?? "",
				userAgent: request.headers.get("user-agent") ?? ""
			})
		})
})
