import { fTimeStamp } from '@/lib/utils/date'
import { TCookie } from '@/types/cookie'
import { ColumnDef } from '@tanstack/react-table'
import SwitchCookieCol from '../components/col/SwitchCookieCol'
import ChangeCookieCol from '../components/col/ChangeCookieCol'
import UserInfoCol from '../components/col/UserInfoCol'
import CookieStatusCol from '../components/col/CookieStatusCol'

const cookieTable = (): ColumnDef<TCookie>[] => {
  return [
    {
      accessorKey: 'action',
      header: '',
      cell: ({ row }) => <SwitchCookieCol cookie={row.original} />
    },
    {
      accessorKey: '_id',
      header: 'ID',
      cell: ({ row }) => <span className='hover:text-[#FF5630] hover:underline'>{row.original._id}</span>
    },
    {
      accessorKey: 'user_info',
      header: 'ID',
      cell: ({ row }) => <UserInfoCol user={row.original.user_info} />
    },
    {
      accessorKey: 'cookie',
      header: 'Cookie',
      cell: ({ row }) => <ChangeCookieCol cookie={row.original} />
    },
    {
      accessorKey: 'status',
      header: () => <div className='w-[100px] text-center'>Status</div>,
      cell: ({ row }) => <CookieStatusCol status={row.original.status} />
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => <div className='w-[100px]'>{fTimeStamp(row.original.createdAt, 'DD-MM-YYYY')}</div>
    }
  ]
}
export default cookieTable
