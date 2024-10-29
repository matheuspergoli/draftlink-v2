import { createClient, type Client } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import { serverEnv } from "@/environment/server"

import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
	client: Client | undefined
}

export const client =
	globalForDb.client ??
	createClient({
		url: serverEnv.TURSO_CONNECTION_URL,
		authToken: serverEnv.TURSO_AUTH_TOKEN
	})

if (serverEnv.NODE_ENV === "production") globalForDb.client = client

export const db = drizzle(client, {
	schema
})
