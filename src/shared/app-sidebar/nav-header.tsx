import * as React from "react"

import { RocketIcon } from "lucide-react"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar"

export const NavHeader = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<RocketIcon className="size-4" />
					</div>
					<span className="truncate font-semibold">Draftlink</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
