import { DateRangePicker } from '@/components/element/DateRangerPicker'
import { TLadingCodeFilterSchema } from '@/schema/ladingCode'
import { useFormContext } from 'react-hook-form'
import SearchForm from './form/SearchForm'
import TabsStatus from './TabStatus'
import { FILTER_OPTIONS_LIST } from '@/common/constants'
import SortBy from './form/SortBy'

const FilterOption = () => {
  const form = useFormContext<TLadingCodeFilterSchema>()

  return (
    <form>
      <TabsStatus onChange={(value) => form.setValue('status', value)} tabs={FILTER_OPTIONS_LIST} />
      <div className='flex w-full items-center gap-4 pt-5'>
        <DateRangePicker
          onUpdate={({ range }) => {
            form.setValue('dateFrom', range.from.toISOString())
            form.setValue('dateTo', range.to?.toISOString())
          }}
          initialDateFrom='2023-01-01'
          initialDateTo='2023-12-31'
          align='start'
          locale='en-GB'
          showCompare={false}
          className='h-[54px] rounded-lg'
        />
        <SearchForm className='flex-1' control={form.control} name={'search'} />
        <SortBy control={form.control} name={'orderBy'} />
      </div>
    </form>
  )
}

export default FilterOption
