import { KEY_LADING_CODE, LADING_CODE_STATUS } from '@/common/constants'
import { cn } from '@/lib/utils'

type Props = {
  status: string
}

const StatusLadingCol = ({ status }: Props) => {
  const statusColor = (value: string) => {
    switch (value) {
      case KEY_LADING_CODE.CANCELLED:
        return 'text-[#4F378A] bg-[#EADDFF]'
      case KEY_LADING_CODE.COMPLETED:
        return 'text-[#01B059] bg-[#57FCBF]'
      default:
        return 'text-white bg-[#1C252E]'
    }
  }
  return (
    <div className={cn('flex h-6 w-fit items-center rounded-md px-1.5 text-xs font-bold', statusColor(status))}>
      {LADING_CODE_STATUS[status as keyof typeof LADING_CODE_STATUS] || ''}
    </div>
  )
}
export default StatusLadingCol
