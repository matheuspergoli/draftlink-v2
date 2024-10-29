import { TRPCError } from "@trpc/server"
import { and, count, eq } from "drizzle-orm"
import { z } from "zod"

import { linksTable } from "../db/schema"
import { authedProcedure, createTRPCRouter } from "../trpc"
import { checkLinkNsfw } from "../utils/check-link-nsfw"

export const linkRouter = createTRPCRouter({
	countLinks: authedProcedure.query(async ({ ctx }) => {
		const linksCount = await ctx.db
			.select({ count: count(linksTable.id) })
			.from(linksTable)
			.where(eq(linksTable.userId, ctx.user.id))
			.then((res) => res[0]?.count ?? 0)

		return linksCount
	}),
	getLinks: authedProcedure.query(async ({ ctx }) => {
		const links = await ctx.db.query.linksTable.findMany({
			where: eq(linksTable.userId, ctx.user.id)
		})

		return links
	}),
	getLink: authedProcedure
		.input(z.object({ linkId: z.string() }))
		.query(async ({ ctx, input }) => {
			const link = await ctx.db.query.linksTable.findFirst({
				where: and(eq(linksTable.id, input.linkId), eq(linksTable.userId, ctx.user.id))
			})

			if (!link) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Link not found"
				})
			}

			return link
		}),
	deleteLink: authedProcedure
		.input(
			z.object({
				linkId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const link = await ctx.db.query.linksTable.findFirst({
				where: and(eq(linksTable.id, input.linkId), eq(linksTable.userId, ctx.user.id))
			})

			if (!link) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Link not found"
				})
			}

			await ctx.db.delete(linksTable).where(eq(linksTable.id, link.id))
		}),
	deleteAllLinks: authedProcedure.mutation(async ({ ctx }) => {
		await ctx.db.delete(linksTable).where(eq(linksTable.userId, ctx.user.id))
	}),
	changeVisibility: authedProcedure
		.input(
			z.object({
				linkId: z.string(),
				visibility: z.boolean()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const link = await ctx.db.query.linksTable.findFirst({
				where: and(eq(linksTable.id, input.linkId), eq(linksTable.userId, ctx.user.id))
			})

			if (!link) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Link not found"
				})
			}

			await ctx.db
				.update(linksTable)
				.set({ visibility: input.visibility })
				.where(eq(linksTable.id, link.id))
		}),
	editLink: authedProcedure
		.input(
			z.object({
				linkId: z.string(),
				url: z.string().url(),
				name: z.string().min(3).max(40)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const link = await ctx.db.query.linksTable.findFirst({
				where: and(eq(linksTable.id, input.linkId), eq(linksTable.userId, ctx.user.id))
			})

			if (!link) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Link not found"
				})
			}

			const isLinkNsfw = checkLinkNsfw(input.url)

			await ctx.db
				.update(linksTable)
				.set({
					url: input.url,
					name: input.name,
					nsfw: isLinkNsfw
				})
				.where(eq(linksTable.id, link.id))
		}),
	createLink: authedProcedure
		.input(
			z.object({
				url: z.string().url(),
				name: z.string().min(3).max(40)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { countLinks } = await ctx.db
				.select({ countLinks: count(linksTable.id) })
				.from(linksTable)
				.where(eq(linksTable.userId, ctx.user.id))
				.limit(1)
				.then((res) => res[0] ?? { countLinks: 0 })

			if (countLinks >= 10) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Links limit has been reached"
				})
			}

			const isLinkNsfw = checkLinkNsfw(input.url)

			const link = await ctx.db
				.insert(linksTable)
				.values({
					userId: ctx.user.id,
					name: input.name,
					url: input.url,
					nsfw: isLinkNsfw
				})
				.returning()
				.then((res) => res[0] ?? null)

			if (!link) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create link"
				})
			}
		})
})
