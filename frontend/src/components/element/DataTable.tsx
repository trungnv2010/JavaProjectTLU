import { TTableProps } from '@/types/table'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import React from 'react'
import PaginationTable from './PaginationTable'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'
import NoDataTable from './NoDataTable'

const DataTable = <T extends object>({
  data,
  columns,
  loading = false,
  total,
  renderSubComponent,
  getRowCanExpand,
  pagination,
  setPagination,
  getRowsSelected,
  className
}: TTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState({})
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination: {
        pageIndex: pagination ? pagination.page - 1 : 1,
        pageSize: pagination ? pagination.limit : 10
      }
    }
  })
  useEffect(() => {
    if (getRowsSelected) {
      const rowSelected = table.getGroupedSelectedRowModel().rows.map((row) => row.original)
      getRowsSelected(rowSelected || [])
    }
  }, [rowSelection, getRowsSelected, table])

  return (
    <>
      <div className={cn('overflow-hidden')}>
        <div className={cn('relative max-w-full overflow-auto', className)}>
          <Table>
            <TableHeader className='sticky top-0 z-50 h-[86px] flex-shrink-0 bg-[#F4F6F8]'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className='flex-shrink-0 text-sm font-medium leading-6'
                        style={{ width: `${header.getSize()}px` }}
                        key={header.id}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {loading ? (
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <Skeleton className='h-6 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && 'selected'}
                        className='cursor-pointer hover:bg-[#FFFBF6]'
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.column.id === 'expander' ? (
                              row.getCanExpand() ? (
                                <button
                                  {...{
                                    onClick: row.getToggleExpandedHandler(),
                                    style: { cursor: 'pointer' }
                                  }}
                                >
                                  {row.getIsExpanded() ? (
                                    <ChevronDown className='h-4 w-4' />
                                  ) : (
                                    <ChevronRight className='h-4 w-4' />
                                  )}
                                </button>
                              ) : null
                            ) : (
                              flexRender(cell.column.columnDef.cell, cell.getContext())
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <AnimatePresence>
                        {row.getIsExpanded() && renderSubComponent && (
                          <TableRow>
                            <TableCell colSpan={columns.length}>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                {renderSubComponent(row.original)}
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={columns.length} className='h-96 text-center hover:bg-transparent'>
                      <NoDataTable />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
      {pagination && setPagination && data.length > 0 ? (
        <PaginationTable
          limit={pagination.limit}
          countData={total}
          page={pagination.page}
          setPage={(page) => {
            setPagination({
              ...pagination,
              page
            })
          }}
          setLimit={(limit) => {
            setPagination({
              ...pagination,
              limit,
              page: 1
            })
          }}
          totalPages={Math.ceil((total ?? 0) / pagination.limit)}
        />
      ) : (
        <></>
      )}
    </>
  )
}
export default DataTable
