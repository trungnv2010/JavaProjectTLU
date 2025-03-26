import { SORT_BY } from '@/common/constants'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { TLadingCodeFilterSchema } from '@/schema/ladingCode'
import { EllipsisVertical } from 'lucide-react'
import { Control } from 'react-hook-form'

type Props = {
  control: Control<TLadingCodeFilterSchema>
  name: keyof TLadingCodeFilterSchema
}

const SortBy = ({ control, name }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className='flex items-center p-2'>
                  <EllipsisVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={'start'} className='min-w-[138px] rounded-[5px] px-2.5 py-3'>
                {SORT_BY.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn('px-4 text-sm', value === option.value && 'text-destructive')}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SortBy
