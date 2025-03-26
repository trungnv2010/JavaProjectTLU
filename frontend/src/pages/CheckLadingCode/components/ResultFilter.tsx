import { TLadingCodeFilterSchema } from '@/schema/ladingCode'
import { useFormContext } from 'react-hook-form'
import FilterChip from './FilterChip'
import { SORT_BY } from '@/common/constants'
import { fTime } from '@/lib/utils/date'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { Ban } from 'lucide-react'

type Props = {
  onCancelOrder: () => void
}

const ResultFilter = ({ onCancelOrder }: Props) => {
  const form = useFormContext<TLadingCodeFilterSchema>()
  const formValues = form.watch()

  const clearFilter = (key: keyof TLadingCodeFilterSchema) => {
    form.setValue(key, undefined)
  }
  const activeFilters = Object.entries(formValues).filter(([key, value]) => key !== 'status' && !!value)
  if (activeFilters.length == 0) return null
  return (
    <div className='flex flex-wrap gap-2'>
      {Object.entries(formValues).map(([key, value]) => {
        if (value) {
          switch (key) {
            case 'status':
              return null
            case 'orderBy':
              return (
                <FilterChip
                  key={key}
                  title={key}
                  value={SORT_BY.find((item) => item.value === value)?.label || ''}
                  onClick={() => clearFilter(key as keyof TLadingCodeFilterSchema)}
                />
              )
            case 'dateFrom':
            case 'dateTo':
              return (
                <FilterChip
                  key={key}
                  title={key}
                  value={fTime(value, 'DD-MM-YYYY')}
                  onClick={() => clearFilter(key as keyof TLadingCodeFilterSchema)}
                />
              )
            default:
              return (
                <FilterChip
                  key={key}
                  title={String(key)}
                  value={value}
                  onClick={() => clearFilter(key as keyof TLadingCodeFilterSchema)}
                />
              )
          }
        }
        return null
      })}
      {activeFilters.length > 0 && (
        <Button
          className='text-sm font-semibold text-destructive hover:bg-inherit hover:text-destructive/25'
          variant={'ghost'}
          onClick={onCancelOrder}
        >
          <Ban size={24} />
          {t('button.cancelOrder')}
        </Button>
      )}
    </div>
  )
}

export default ResultFilter
