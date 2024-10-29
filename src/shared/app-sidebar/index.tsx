import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail
} from "@/shared/ui/sidebar"

import { NavContent } from "./nav-content"
import { NavFooter } from "./nav-footer"
import { NavHeader } from "./nav-header"

export const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<NavHeader />
			</SidebarHeader>

			<SidebarContent>
				<NavContent />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
