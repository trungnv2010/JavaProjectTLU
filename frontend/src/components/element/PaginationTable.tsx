import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import PageRow from './PageRow'

type Props = {
  page: number
  setPage: (page: number) => void
  totalPages: number
  limit: number
  countData?: number
  setLimit: (limit: number) => void
  isChangePerPage?: boolean
}

const PaginationTable = ({ page, setPage, totalPages, limit, countData, setLimit, isChangePerPage = true }: Props) => {
  const { t } = useTranslation()
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (page <= 3 || page >= totalPages - 2) {
      pages.push(2, 3, 'ellipsis', totalPages - 2, totalPages - 1)
    } else {
      pages.push('ellipsis', page - 1, page, page + 1, 'ellipsis')
    }

    pages.push(totalPages)

    return pages
  }

  return (
    <Pagination className='gap mr-auto mt-6 flex items-end justify-end'>
      {isChangePerPage && (
        <div className='flex items-center gap-2 text-sm font-medium'>
          <p>{t('common.rowPage')}</p>
          <PageRow page={limit} setPage={(value) => setLimit(value)} />
          <p>/{Number(countData).toLocaleString()}</p>
        </div>
      )}
      <PaginationContent className='w-fit'>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={cn('cursor-pointer', page <= 1 ? 'pointer-events-none opacity-50' : '')}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`} className='text-filter'>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                className={`cursor-pointer border-none shadow-none ${
                  page === pageNumber ? 'text-primary' : 'text-filter'
                }`}
                isActive={page === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={cn(page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationTable
