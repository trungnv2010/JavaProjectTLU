import { TLadingCode } from '@/types/cookie'
import { ColumnDef } from '@tanstack/react-table'
import UserInfoCol from '../components/col/UserInfoCol'
import { fCtime } from '@/lib/utils/date'
import { Checkbox } from '@/components/ui/checkbox'
import ActionLadingCol from '../components/col/ActionLadingCol'
import { cn } from '@/lib/utils'
import StatusLadingCol from '../components/col/StatusLadingCol'
import { t } from 'i18next'

const ladingCodeTable = (): ColumnDef<TLadingCode>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className='data-[state=checked]:border-[#FF5630] data-[state=checked]:bg-[#FF5630]'
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className='data-[state=checked]:border-[#FF5630] data-[state=checked]:bg-[#FF5630]'
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      size: 36
    },
    {
      accessorKey: 'order_list.order_id',
      header: t('ladingCode.checkLadingCode'),
      cell: ({ row }) => (
        <span className={cn(row.getIsSelected() && 'text-[#FF5630] underline')}>{row.original.order_id}</span>
      )
    },
    {
      accessorKey: 'userInfo',
      header: t('ladingCode.userInfo'),
      cell: ({ row }) => <UserInfoCol user={row.original.userInfo} />
    },
    {
      accessorKey: 'shipping',
      header: t('ladingCode.shipping'),
      cell: ({ row }) => (
        <div className='flex w-[161px] flex-col text-sm'>
          <div>{row.original.shipping.tracking_info.driver_name || '--'}</div>
          <div className='text-muted-foreground'>{row.original.shipping.tracking_info.driver_phone || '--'}</div>
        </div>
      ),
      size: 167
    },
    {
      accessorKey: 'Date',
      header: t('ladingCode.date'),
      cell: ({ row }) => {
        const { date, time } = fCtime(row.original.shipping.tracking_info.ctime)
        return (
          <div className='flex w-[161px] flex-col text-sm'>
            <span className=''>{date}</span>
            <span className='text-muted-foreground'>{time}</span>
          </div>
        )
      },
      size: 161
    },
    {
      accessorKey: 'shope_name',
      header: t('ladingCode.shopName'),
      cell: ({ row }) => <div className='w-[242px] text-sm'>{row.original.orders.shop_info.shop_name || '--'}</div>
    },
    {
      accessorKey: 'address',
      header: t('ladingCode.address'),
      cell: ({ row }) => <div className='w-[242px] text-sm'>{row.original.address.shipping_address}</div>,
      size: 242
    },
    {
      accessorKey: 'status',
      header: t('ladingCode.status'),
      cell: ({ row }) => <StatusLadingCol status={row.original.status.status_label.text} />
    },
    {
      accessorKey: 'action',
      header: '',
      cell: ({ row }) => <ActionLadingCol row={row} />
    }
  ]
}
export default ladingCodeTable
