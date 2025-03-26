import { cn } from '@/lib/utils'
import { COOKIE_STATUS } from '@/types/cookie'

type Props = {
  status: COOKIE_STATUS
}

const CookieStatusCol = ({ status }: Props) => {
  const statusColor = (value: COOKIE_STATUS) => {
    switch (value) {
      case COOKIE_STATUS.ACTIVE:
        return 'text-[#01B059] bg-[#57FCBF]'
      case COOKIE_STATUS.FAILED:
        return 'text-red-600 bg-red-200'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className='flex w-full items-center justify-center'>
      <div className={cn('w-fit rounded-md px-2 py-0.5', statusColor(status))}>{status}</div>
    </div>
  )
}
export default CookieStatusCol
