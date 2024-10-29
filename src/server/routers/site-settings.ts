import { TRPCError } from "@trpc/server"
import { and, count, eq, not } from "drizzle-orm"
import { z } from "zod"

import { validateSiteName } from "@/libs/validate-site-name"

import { linksTable, siteSettingsTable, usersTable } from "../db/schema"
import { authedProcedure, createTRPCRouter } from "../trpc"

export const siteSettingsRouter = createTRPCRouter({
	getSiteSettings: authedProcedure.query(async ({ ctx }) => {
		const siteSettings = await ctx.db.query.siteSettingsTable.findFirst({
			where: eq(siteSettingsTable.userId, ctx.user.id)
		})

		if (!siteSettings) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Site settings not found"
			})
		}

		return siteSettings
	}),
	getSiteSettingsByName: authedProcedure
		.input(z.object({ name: z.string() }))
		.query(async ({ input, ctx }) => {
			const desiredName = input.name.toLowerCase()
			const isValidName = validateSiteName(input.name)

			if (!isValidName.isValid) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Not found"
				})
			}

			const siteSettingsExists = await ctx.db
				.select({
					count: count(siteSettingsTable.id)
				})
				.from(siteSettingsTable)
				.where(eq(siteSettingsTable.name, desiredName))
				.then((value) => value[0]?.count ?? 0)

			if (!siteSettingsExists) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Not found"
				})
			}

			const siteSettings = await ctx.db
				.select({
					site: siteSettingsTable,
					links: linksTable
				})
				.from(siteSettingsTable)
				.innerJoin(usersTable, eq(siteSettingsTable.userId, usersTable.id))
				.leftJoin(linksTable, eq(usersTable.id, linksTable.userId))
				.where(eq(siteSettingsTable.name, desiredName))

			if (!siteSettings) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Not found"
				})
			}

			const result = {
				site: siteSettings[0]?.site,
				links: siteSettings.filter((value) => value.links).map((value) => value.links)
			}

			return result
		}),
	editSiteSettings: authedProcedure
		.input(
			z.object({
				name: z.string().min(3).max(55),
				title: z.string().max(55).optional().nullable(),
				description: z.string().max(140).optional().nullable()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const desiredName = input.name.toLowerCase()
			const isValidName = validateSiteName(input.name)

			if (!isValidName.isValid) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: isValidName.error
				})
			}

			const siteSettings = await ctx.db.query.siteSettingsTable.findFirst({
				where: eq(siteSettingsTable.userId, ctx.user.id)
			})

			if (!siteSettings) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Error updating site settings"
				})
			}

			const nameExists = await ctx.db
				.select({ count: count(siteSettingsTable.id) })
				.from(siteSettingsTable)
				.where(
					and(
						eq(siteSettingsTable.name, desiredName),
						not(eq(siteSettingsTable.userId, ctx.user.id))
					)
				)
				.then((value) => value[0]?.count ?? 0)

			if (nameExists) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Name is already taken"
				})
			}

			await ctx.db
				.update(siteSettingsTable)
				.set({
					name: desiredName,
					displayName: input.name,
					title: input.title,
					description: input.description
				})
				.where(eq(siteSettingsTable.userId, ctx.user.id))
		}),

	createSiteSettings: authedProcedure
		.input(z.object({ name: z.string().min(3).max(55) }))
		.mutation(async ({ ctx, input }) => {
			const desiredName = input.name.toLowerCase()
			const isValidName = validateSiteName(input.name)

			if (!isValidName.isValid) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: isValidName.error
				})
			}

			const siteSettigsExists = await ctx.db.query.siteSettingsTable.findFirst({
				where: eq(siteSettingsTable.userId, ctx.user.id)
			})

			if (siteSettigsExists) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You alredy have a site settings setup"
				})
			}

			const nameExists = await ctx.db
				.select()
				.from(siteSettingsTable)
				.where(eq(siteSettingsTable.name, desiredName))
				.then((value) => value[0] ?? null)

			if (nameExists) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Name is already taken"
				})
			}

			await ctx.db.insert(siteSettingsTable).values({
				userId: ctx.user.id,
				name: desiredName,
				displayName: input.name
			})

			await ctx.db
				.update(usersTable)
				.set({ hasCompletedOnboarding: true })
				.where(eq(usersTable.id, ctx.user.id))
		})
})
