import { defineConfig } from "drizzle-kit"

import { serverEnv } from "./src/environment/server"

export default defineConfig({
	schema: "./src/server/db/schema.ts",
	out: "./migrations",
	dialect: "turso",
	dbCredentials: {
		url: serverEnv.TURSO_CONNECTION_URL,
		authToken: serverEnv.TURSO_AUTH_TOKEN
	}
})
