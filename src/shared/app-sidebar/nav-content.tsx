import { Link } from "@tanstack/react-router"

import { ChartNoAxesColumnIncreasing, Globe, Settings } from "lucide-react"

import { api } from "@/libs/trpc"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/shared/ui/sidebar"

export const NavContent = () => {
	const { data } = api.siteSettings.getSiteSettings.useQuery()

	return (
		<SidebarGroup>
			<SidebarGroupLabel>General</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<Link to="/dashboard">
							<ChartNoAxesColumnIncreasing />
							<span>Dashboard</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<Link to="/dashboard/settings">
							<Settings />
							<span>Settings</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				{data && (
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/l/$siteName" params={{ siteName: data.displayName }}>
								<Globe />
								<span>Your site</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
