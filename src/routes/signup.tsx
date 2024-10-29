import { createFileRoute, redirect } from "@tanstack/react-router"

import { SignUpCard } from "@/features/auth/components/signup-card"

export const Route = createFileRoute("/signup")({
	component: SignUp,
	beforeLoad: async ({ context }) => {
		const user = await context.trpcQueryUtils.user.getCurrentUser.fetch()

		if (user?.id) {
			throw redirect({
				to: "/dashboard"
			})
		}
	}
})

function SignUp() {
	return (
		<main className="container mx-auto flex h-screen w-screen items-center justify-center">
			<SignUpCard />
		</main>
	)
}
