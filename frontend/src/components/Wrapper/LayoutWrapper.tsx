import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

const LayoutWrapper = ({ children, className }: Props) => {
  return <div className={cn('bg-[url(/src/assets/image.png)] bg-center bg-no-repeat', className)}>{children}</div>
}
export default LayoutWrapper
