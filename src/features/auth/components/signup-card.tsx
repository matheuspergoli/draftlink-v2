import { Link } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/libs/utils"
import { Button, buttonVariants } from "@/shared/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { PasswordInput } from "@/shared/ui/password-input"

import { useSignUp } from "../hooks/use-signup"
import { SignUpSchema, type SignUpData } from "../schemas/signup-schema"

export const SignUpCard = () => {
	const { onSubmit, isPending } = useSignUp()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpData>({
		resolver: zodResolver(SignUpSchema)
	})

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-center text-2xl">Draftlink - Sign Up</CardTitle>
				<CardDescription className="flex flex-col items-center text-base">
					<span>Welcome to Draftlink!</span>
					<span>Please sign up to continue.</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">
					<div>
						<Label htmlFor={register("email").name}>Email</Label>
						<Input placeholder="my@email.com" {...register("email")} />
						{errors.email && (
							<span className="text-sm text-red-500">{errors.email.message}</span>
						)}
					</div>

					<div>
						<Label htmlFor={register("password").name}>Password</Label>
						<PasswordInput {...register("password")} />
						{errors.password && (
							<span className="text-sm text-red-500">{errors.password.message}</span>
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
						isLoading={isPending}>
						{isPending ? "Signing up..." : "Sign up"}
					</Button>

					<a
						className={cn(buttonVariants({ variant: "outline" }), "w-full")}
						href="/api/login/github/index"
						type="button">
						Sign up with Github
					</a>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center gap-3">
				<span>Already have an account?</span>
				<Link to="/login" className="underline">
					Login
				</Link>
			</CardFooter>
		</Card>
	)
}