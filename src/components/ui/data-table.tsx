'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from './button';
import { Input } from './input';

/**
 * Props for the DataTable component.
 *
 * @template TData - The type of data being displayed in the table.
 * @template TValue - The type of value for each column.
 *
 * @property {ColumnDef<TData, TValue>[]} columns - The definitions of the columns in the table.
 * @property {TData[]} data - The data to be displayed in the table.
 * @property {string} [filterBy] - The accessor key of the search filter used.
 * @property {number} [pageSize] - The number of entries to display per page.
 * @property {boolean} [showRowSelection] - Whether to display the text for the number of rows selected.
 * @property {string} [selectionButtonText] - The text to display on the selection button.
 * @property {(selectedRows: TData[]) => void} [onSelectionButtonClick] - The callback function to handle selection button click.
 */
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterBy?: string;
	pageSize?: number;
	showRowSelection?: boolean;
	selectionButtonText?: string;
	onSelectionButtonClick?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterBy,
	pageSize = 10,
	showRowSelection,
	selectionButtonText,
	onSelectionButtonClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize,
	});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: setPagination,
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
			rowSelection,
		},
	});

	return (
		<div className="w-full">
			<div className="sm:flex-row sm:items-center justify-end pb-4 gap-4 flex flex-col-reverse items-end">
				{filterBy && (
					<Input
						// TODO: fix placeholder formatting + logic (check allocation table for reference)
						placeholder={`Search ${filterBy}...`}
						value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn(filterBy)?.setFilterValue(event.target.value)
						}
						className="sm:max-w-xs"
					/>
				)}
				<div className="flex gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Columns <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					{showRowSelection && selectionButtonText && onSelectionButtonClick && (
						<Button
							disabled={
								table.getFilteredSelectedRowModel().rows.length === 0 ? true : false
							}
							onClick={() =>
								onSelectionButtonClick(
									table
										.getFilteredSelectedRowModel()
										.rows.map((row) => row.original)
								)
							}
						>
							{selectionButtonText}
						</Button>
					)}
				</div>
			</div>
			<div className="rounded-md border">
				<Table className="bg-background/40">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-2 px-4 h-16">
											<div className="line-clamp-2">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</div>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-16 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				{showRowSelection && (
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
				)}
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
