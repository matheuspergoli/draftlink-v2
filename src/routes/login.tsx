import { createFileRoute, redirect } from "@tanstack/react-router"

import { LoginCard } from "@/features/auth/components/login-card"

export const Route = createFileRoute("/login")({
	component: Login,
	beforeLoad: async ({ context }) => {
		const user = await context.trpcQueryUtils.user.getCurrentUser.fetch()

		if (user?.id) {
			throw redirect({
				to: "/dashboard"
			})
		}
	}
})

function Login() {
	return (
		<main className="container mx-auto flex h-screen w-screen items-center justify-center">
			<LoginCard />
		</main>
	)
}
