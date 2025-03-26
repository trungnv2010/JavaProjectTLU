import { cn } from '@/lib/utils'

type Props = {
  content: string
  className?: string
}

const Title = ({ content, className }: Props) => (
  <div className={cn('text-5xl leading-[64px] tracking-[-0.06px] font-semibold text-center', className)}>{content}</div>
)

export default Title
