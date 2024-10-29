import type { ColumnDef } from "@tanstack/react-table"
import { LoaderCircle, Settings, Trash } from "lucide-react"

import { api } from "@/libs/trpc"
import type { LinkSelect } from "@/server/db/schema"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/shared/ui/alert-dialog"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/shared/ui/sheet"

import { ChangeLinkVisibility } from "../components/change-link-visibility"
import { EditLinkForm } from "../components/edit-link-form"

export const linkColumns: ColumnDef<LinkSelect>[] = [
	{
		accessorKey: "url",
		header: "URL"
	},
	{
		accessorKey: "name",
		header: "Name"
	},
	{
		accessorKey: "nsfw",
		header: "NSFW",
		cell: (cell) => {
			const { nsfw } = cell.row.original

			return <Badge variant={nsfw ? "default" : "outline"}>{nsfw ? "Yes" : "No"}</Badge>
		}
	},
	{
		accessorKey: "visibility",
		header: "Visibility",
		cell: (cell) => {
			const link = cell.row.original

			return <ChangeLinkVisibility linkId={link.id} visibility={link.visibility} />
		}
	},
	{
		accessorKey: "edit",
		header: "Edit",
		cell: (cell) => {
			const link = cell.row.original

			return (
				<Sheet>
					<SheetTrigger asChild>
						<Button size="icon" variant="outline">
							<Settings />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Edit your link</SheetTitle>
							<SheetDescription>
								You can edit the name and URL of your link.
							</SheetDescription>
						</SheetHeader>

						<EditLinkForm linkId={link.id} {...link} />
					</SheetContent>
				</Sheet>
			)
		}
	},
	{
		accessorKey: "delete",
		header: "Delete",
		cell: (cell) => {
			const link = cell.row.original

			const utils = api.useUtils()
			const { mutate: deleteLink, isPending } = api.link.deleteLink.useMutation({
				onSuccess: () => {
					utils.link.invalidate()
				}
			})

			return (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size="icon" variant="destructive" disabled={isPending}>
							{isPending ? <LoaderCircle className="animate-spin" /> : <Trash />}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your link.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => deleteLink({ linkId: link.id })}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)
		}
	}
]
