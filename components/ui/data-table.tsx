'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from './scroll-area'
import Search from './search'
import { QueryResponse } from '@/lib/entity/core/interface'
import Pagination from './pagination'
import { Filters } from '../table-filter/filters'
import { useCustomSWR } from '@/hooks/use-custom-swr'
import { useUpdatedUrl } from '@/hooks/use-updated-url'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  response: QueryResponse<TData>
  searchTitle: string
  groupAction?: any
  refetchDataUrl?: string
  params?: Record<string, string | number>
  showSearch?: boolean
  showFilters?: boolean
  showPagination?: boolean
  showGroupAction?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  response,
  searchTitle,
  groupAction,
  refetchDataUrl = '#',
  showSearch = true,
  showFilters = true,
  showPagination = true,
  showGroupAction = true,
  params = {},
}: DataTableProps<TData, TValue>) {
  const { buildUrlWithParams } = useUpdatedUrl()
  const { data, isLoading } = useCustomSWR({
    url: buildUrlWithParams(refetchDataUrl),
    initialData: response,
  })
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
  /* this can be used to get the selectedrows */
  const isSelected = table.getFilteredSelectedRowModel().flatRows.length > 0
  const selectedItems = table
    .getFilteredSelectedRowModel()
    .flatRows.map((row) => row.original)
  const GroupAction = groupAction
  return (
    <>
      <div className="flex space-x-2 space-x-reverse space-y-2 md:space-y-0 flex-col md:flex-row">
        {showSearch && <Search placeholder={searchTitle} />}
        {showFilters && <Filters table={table} />}
      </div>
      <ScrollArea className="">
        <Table className="relative">
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
                  )
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  عه!
                  <br />
                  خالیه که
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 space-x-reverse py-4">
        {showGroupAction && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} از{' '}
            {table.getFilteredRowModel().rows.length} ردیف انتخاب شده
          </div>
        )}
        {showPagination && (
          <div className="space-x-reverse space-x-2">
            <Pagination totalPages={data.totalPages} />
          </div>
        )}
      </div>
      {isSelected && groupAction && (
        <div className="fixed bottom-0 p-4 bg-white dark:bg-gray-950 w-full border-t">
          <GroupAction table={table} items={selectedItems} />
        </div>
      )}
    </>
  )
}
