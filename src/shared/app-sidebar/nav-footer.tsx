import { useNavigate } from "@tanstack/react-router"

import { ChevronsUpDown, LogOut, Moon, Sun } from "lucide-react"

import { api } from "@/libs/trpc"
import { run } from "@/libs/utils"
import { useTheme } from "@/providers/theme-provider"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/shared/ui/sidebar"

export const NavFooter = () => {
	const navigate = useNavigate()
	const { isMobile } = useSidebar()
	const { setTheme, theme } = useTheme()

	const utils = api.useUtils()
	const { data: user } = api.user.getCurrentUser.useQuery()
	const { mutate: logout } = api.user.logout.useMutation({
		onSuccess: () => {
			utils.user.invalidate()

			navigate({ to: "/login" })
		}
	})

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
					{run(() => {
						if (theme === "dark") {
							return (
								<>
									<Moon />
									<span>Dark mode</span>
								</>
							)
						}

						return (
							<>
								<Sun />
								<span>Light mode</span>
							</>
						)
					})}
				</SidebarMenuButton>
			</SidebarMenuItem>

			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarFallback className="rounded-lg">
									{user?.username?.charAt(0) || "CN"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user?.username}</span>
								<span className="truncate text-xs">{user?.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg">
										{user?.username?.charAt(0) || "CN"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user?.username}</span>
									<span className="truncate text-xs">{user?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => logout()}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
