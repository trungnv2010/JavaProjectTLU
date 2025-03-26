import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TLadingCode } from '@/types/cookie'
import { Row } from '@tanstack/react-table'
import { t } from 'i18next'
import { ChevronDown, EllipsisVertical, Eye } from 'lucide-react'

type Props = {
  row: Row<TLadingCode>
}

const ActionLadingCol = ({ row }: Props) => {
  return (
    <div className='flex items-center gap-2'>
      <Button
        onClick={() => row.toggleExpanded()}
        className='h-9 w-9 cursor-pointer rounded-full'
        size={'icon'}
        variant={'secondary'}
      >
        <ChevronDown className={cn('duration-300', row.getIsExpanded() && 'rotate-180')} size={24} />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button className='h-9 w-9' size={'icon'} variant={'ghost'}>
            <EllipsisVertical size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[155px] p-0'>
          <Button className='w-full text-sm hover:bg-[#FFFBF6] hover:text-[#FF5630]' variant={'ghost'}>
            <Eye size={24} />
            {t('button.viewDetail')}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
export default ActionLadingCol
