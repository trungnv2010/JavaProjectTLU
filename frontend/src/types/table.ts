import { ColumnDef, Row, SortingState, Table } from '@tanstack/react-table'

export type TParams = {
  page: number
  limit: number
}

export type TTableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  total?: number
  renderSubComponent?: (row: T) => React.ReactNode
  getRowCanExpand?: (row: Row<T>) => boolean
  body?: (data: Table<T>) => React.ReactNode
  getRowsSelected?: (row: T[]) => void
  getSortingChange?: (sort: SortingState) => void
  onResetFilter?: (ref: () => void) => void
  className?: string
  classNameHeader?: string
  classNameBody?: string
  containerClassName?: string
  pagination?: TParams
  setPagination?: (pagination: TParams) => void
}
