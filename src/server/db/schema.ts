import {
	customType,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from "drizzle-orm/sqlite-core"

import { generateId } from "../utils/generate-id"

export type OauthProviderIds = "github" | "google"

export const oauthProviderIds = customType<{ data: OauthProviderIds }>({
	dataType() {
		return "github"
	}
})

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		username: text("username"),
		passwordHash: text("password_hash"),
		email: text("email").unique().notNull(),
		hasCompletedOnboarding: integer("has_completed_onboarding", { mode: "boolean" })
			.notNull()
			.default(false),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return {
			emailIdx: uniqueIndex("user_email_idx").on(table.email),
			usernameIdx: index("user_username_idx").on(table.username)
		}
	}
)

export const oauthAccountsTable = sqliteTable(
	"oauth_accounts",
	{
		providerUserId: text("provider_user_id").notNull(),
		providerId: oauthProviderIds("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
			providerUserIdIdx: index("oauth_account_provider_user_id_idx").on(
				table.providerUserId
			),
			userIdIdx: index("oauth_account_user_id_idx").on(table.userId)
		}
	}
)

export const linksTable = sqliteTable(
	"links",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		url: text("url").notNull(),
		name: text("name").notNull(),
		nsfw: integer("nsfw", { mode: "boolean" }).notNull(),
		visibility: integer("visibility", { mode: "boolean" }).notNull().default(true),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return {
			nsfwIdx: index("link_nsfw_idx").on(table.nsfw),
			userIdIdx: index("link_user_id_idx").on(table.userId),
			visibilityIdx: index("link_status_idx").on(table.visibility)
		}
	}
)

export const trackableLinksTable = sqliteTable(
	"trackable_links",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		ip: text("ip").notNull(),
		userAgent: text("user_agent").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		linkId: text("link_id")
			.notNull()
			.references(() => linksTable.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => {
		return {
			linkIdIdx: index("trackable_link_id_idx").on(table.linkId),
			userIdIdx: index("trackable_user_id_idx").on(table.userId)
		}
	}
)

export const siteSettingsTable = sqliteTable("site_settings", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	title: text("title"),
	name: text("name").notNull(),
	description: text("description"),
	displayName: text("display_name").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
})

export const sessionsTable = sqliteTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull()
	},
	(table) => {
		return {
			userIdIdx: index("session_user_id_idx").on(table.userId),
			expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt)
		}
	}
)

export type UserSelect = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert

export type LinkSelect = typeof linksTable.$inferSelect
export type LinkInsert = typeof linksTable.$inferInsert

export type SessionSelect = typeof sessionsTable.$inferSelect
export type SessionInsert = typeof sessionsTable.$inferInsert

export type SiteSettingsSelect = typeof siteSettingsTable.$inferSelect
export type SiteSettingsInsert = typeof siteSettingsTable.$inferInsert

export type OauthAccountSelect = typeof oauthAccountsTable.$inferSelect
export type OauthAccountInsert = typeof oauthAccountsTable.$inferInsert

export type TrackableLinkSelect = typeof trackableLinksTable.$inferSelect
export type TrackableLinkInsert = typeof trackableLinksTable.$inferInsert
