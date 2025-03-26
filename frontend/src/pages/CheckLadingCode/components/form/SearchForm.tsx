import SearchBar from '@/components/element/SearchBar'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { TLadingCodeFilterSchema } from '@/schema/ladingCode'
import { Control } from 'react-hook-form'

type SearchFormProps = {
  control: Control<TLadingCodeFilterSchema>
  name: keyof TLadingCodeFilterSchema
  className?: string
}
const SearchForm = ({ control, name, className }: SearchFormProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <FormControl>
            <SearchBar className='w-full' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default SearchForm
