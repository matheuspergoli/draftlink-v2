import { eq } from "drizzle-orm"
import { z } from "zod"

import { usersTable } from "../db/schema"
import {
	deleteSessionTokenCookie,
	getCurrentSession,
	getCurrentUser,
	invalidateSession
} from "../services/sessions"
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
	assertGetCurrentSession: authedProcedure.query(async ({ ctx }) => {
		return ctx.session
	}),
	assertGetCurrentUser: authedProcedure.query(async ({ ctx }) => {
		return ctx.user
	}),
	getCurrentUser: publicProcedure.query(async ({ ctx }) => {
		const user = await getCurrentUser(ctx.event)
		return user
	}),
	getCurrentSession: publicProcedure.query(async ({ ctx }) => {
		const session = await getCurrentSession(ctx.event)
		return session
	}),
	logout: authedProcedure.mutation(async ({ ctx }) => {
		await invalidateSession({ sessionId: ctx.session.id })
		deleteSessionTokenCookie(ctx.event)
	}),
	editUser: authedProcedure
		.input(
			z.object({
				username: z.string().min(3).max(55).optional().nullable()
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(usersTable)
				.set({ username: input.username })
				.where(eq(usersTable.id, ctx.user.id))
		})
})
