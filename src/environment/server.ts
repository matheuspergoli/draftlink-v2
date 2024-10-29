import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const serverEnv = createEnv({
	server: {
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
		TURSO_CONNECTION_URL: z.string(),
		TURSO_AUTH_TOKEN: z.string(),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development")
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true
})
