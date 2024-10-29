import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef
} from "@tanstack/react-table"
import { Trash } from "lucide-react"

import { api } from "@/libs/trpc"
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
import { Button } from "@/shared/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/shared/ui/table"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export const LinkDataTable = <TData, TValue>({
	columns,
	data
}: DataTableProps<TData, TValue>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	const utils = api.useUtils()
	const { data: countLinks } = api.link.countLinks.useQuery()
	const { mutate: deleteAllLinks, isPending } = api.link.deleteAllLinks.useMutation({
		onSuccess: () => {
			utils.link.invalidate()
		}
	})

	return (
		<div className="space-y-5">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="destructive"
						disabled={isPending || countLinks === 0}
						isLoading={isPending}>
						<Trash />
						Delete all links
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
						<AlertDialogAction onClick={() => deleteAllLinks()}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div
				data-delete-all={isPending}
				className="rounded-md border data-[delete-all='true']:pointer-events-none data-[delete-all='true']:animate-pulse">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
